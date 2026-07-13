import { describe, expect, it } from 'vitest';
import { BUILDINGS, DEFAULT_SETTINGS, GOODS, buildingAvailableInEra } from './data';
import { calculateScenario, goalRequirements } from './core';
import type { Entry, Scenario } from './types';

const entry=(id:string,buildingId:string,count:number,modeId='standard',status:Entry['status']='existing'):Entry=>({id,clusterId:'main',buildingId,modeId,count,efficiency:100,staffing:100,distance:'',status,note:'',rateOverrides:{inputs:{},outputs:{}}});
const scenario=(entries:Entry[]):Scenario=>({id:'test',name:'Test',type:'current',clusters:[{id:'main',name:'Hauptcluster',distance:''}],entries,policies:{}});
const calculate=(entries:Entry[])=>calculateScenario({scenario:scenario(entries),buildings:BUILDINGS,goods:GOODS,settings:DEFAULT_SETTINGS});

describe('Kolonialzeit-Berechnung',()=>{
  it('enthält keine doppelten Gebäude-IDs',()=>{
    expect(new Set(BUILDINGS.map((building)=>building.id)).size).toBe(BUILDINGS.length);
  });

  it('versorgt eine Dunder-Destille mit zwei Zuckerplantagen',()=>{
    const result=calculate([entry('sugar','plantation-sugar',2),entry('rum','rum-distillery',1,'dunder')]);
    expect(result.chainSummaries[0].utilization).toBe(1);
    expect(result.totalJobs).toBe(20);
    expect(result.balances.find(x=>x.goodId==='rum')!.produced).toBeGreaterThan(10);
  });

  it('erkennt den Zuckermangel einer zweiten Destille',()=>{
    const result=calculate([entry('sugar','plantation-sugar',2),entry('rum','rum-distillery',2,'dunder')]);
    expect(result.chainSummaries.some(x=>x.utilization<.6)).toBe(true);
    expect(result.diagnostics.some(x=>x.severity==='error')).toBe(true);
  });

  it('berücksichtigt Besetzung und Erwartungsprofil',()=>{
    const full=calculate([entry('sugar','plantation-sugar',1)]);
    const halfEntry=entry('sugar','plantation-sugar',1);halfEntry.staffing=50;
    const half=calculate([halfEntry]);
    expect(half.balances[0].produced).toBeCloseTo(full.balances[0].produced/2);
  });

  it('teilt den Arbeiterbedarf nach Bildungsgrad auf',()=>{
    const result=calculate([entry('sugar','plantation-sugar',2),entry('rum','rum-distillery',1,'dunder')]);
    expect(result.educationJobs).toEqual({'uneducated':20,'high-school':0,'college':0});
    expect(result.educationFilled.uneducated).toBe(20);
  });

  it('zählt auch nicht produzierende Gebäude in der Arbeiterberechnung',()=>{
    const result=calculate([entry('palace','palace',1),entry('newspaper','newspaper',1)]);
    expect(result.educationJobs).toEqual({'uneducated':4,'high-school':4,'college':0});
    expect(result.transportDemand).toBe(0);
  });

  it('plant für eine Destille zwei Zuckerplantagen',()=>{
    const rows=goalRequirements('rum-distillery',1,'dunder',BUILDINGS,DEFAULT_SETTINGS,GOODS);
    expect(rows.map(x=>[x.buildingId,x.recommended])).toEqual([['plantation-sugar',2],['rum-distillery',1]]);
  });

  it('löst eine mehrstufige Bücherkette bis zu Holzstämmen auf',()=>{
    const colonial=BUILDINGS.filter(x=>x.dlc==='base'||x.dlc==='return-to-nature');
    const rows=goalRequirements('printing-house',1,'paper',colonial,DEFAULT_SETTINGS,GOODS);
    expect(rows.map(x=>x.buildingId)).toEqual(['logging-camp','paper-mill','printing-house']);
    expect(rows.every(x=>x.recommended>=1)).toBe(true);
  });

  it('lässt unbekannte Raten sichtbar unberechenbar',()=>{
    const result=calculate([entry('fish','fishermen-wharf',1,'fish')]);
    expect(result.unknownEntries).toBe(1);
    const diagnostic=result.diagnostics.find(x=>x.title.includes('ohne belastbare Rate'))!;
    expect(diagnostic.items).toEqual(['1 × Fischereihafen · Arbeitsmodus: Fisch']);
  });

  it('berechnet die kolonialzeitliche Kapazität eines Transportbüros',()=>{
    const result=calculate([entry('teamster','teamster-office',1)]);
    expect(result.transportCapacity).toBe(6000);
    expect(result.transportDemand).toBe(0);
  });

  it('berücksichtigt lockere Ladegrenzen konservativ mit Faktor 1,35',()=>{
    const result=calculate([entry('teamster','teamster-office',1,'loose-load')]);
    expect(result.transportCapacity).toBeCloseTo(8100);
  });

  it('zählt für den Transportbedarf nur Ausgaben und keine Fabrikeingänge doppelt',()=>{
    const result=calculate([entry('sugar','plantation-sugar',2),entry('rum','rum-distillery',1,'dunder')]);
    expect(result.transportDemand).toBeCloseTo(38);
    expect(result.requiredTeamsterOffices).toBe(1);
    expect(result.teamsterOfficeDifference).toBe(1);
  });

  it('verwendet die Ladekapazität des gewählten Zeitalters',()=>{
    const modern=calculateScenario({scenario:scenario([entry('teamster','teamster-office',1)]),buildings:BUILDINGS,goods:GOODS,settings:DEFAULT_SETTINGS,era:'modern'});
    expect(modern.transportCapacity).toBe(14400);
  });

  it('blendet Gebäude vor ihrem Freischaltzeitalter aus',()=>{
    const modernBuilding={...BUILDINGS[0],availableFrom:'modern' as const};
    expect(buildingAvailableInEra(modernBuilding,'colonial')).toBe(false);
    expect(buildingAvailableInEra(modernBuilding,'modern')).toBe(true);
  });
});
