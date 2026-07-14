import { describe, expect, it } from 'vitest';
import { BUILDINGS, DEFAULT_SETTINGS, GOODS, buildingAvailableInEra } from './data';
import { buildGoalPlan, calculateEntryPerformance, calculateScenario, describeIslandChange, goalRequirements, nextPlayerActions, supplyActionForEntry } from './core';
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

  it('liefert für einen Gebäudeengpass eine direkt ausführbare Bauaktion',()=>{
    const result=calculate([entry('sugar','plantation-sugar',2),entry('rum','rum-distillery',2,'dunder')]);

    expect(supplyActionForEntry(result,'rum')).toEqual({
      buildingId:'plantation-sugar',
      buildingName:'Zuckerplantage',
      goodId:'sugar',
      count:2
    });
  });

  it('priorisiert höchstens drei konkrete nächste Schritte für den Spieler',()=>{
    const understaffed=entry('sugar','plantation-sugar',1);
    understaffed.staffing=50;
    const result=calculate([understaffed,entry('rum','rum-distillery',2,'dunder')]);

    expect(nextPlayerActions(result)).toEqual([
      expect.objectContaining({kind:'supply',title:'2 × Zuckerplantage einplanen',entryId:'rum'}),
      expect.objectContaining({kind:'teamster',title:'7 × Fuhrunternehmen einplanen'}),
      expect.objectContaining({kind:'staffing',title:'4 offene Arbeitsplätze besetzen'})
    ]);
  });

  it('beschreibt die Verbesserung nach einer Inseländerung',()=>{
    const before=calculate([entry('sugar','plantation-sugar',1),entry('rum','rum-distillery',1,'dunder')]);
    const after=calculate([entry('sugar','plantation-sugar',2),entry('rum','rum-distillery',1,'dunder')]);

    expect(describeIslandChange(before,after,'Zuckerplantage eingeplant')).toBe('Zuckerplantage eingeplant: 1 Produktionsengpass behoben.');
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

  it('erfindet für eine unvollständig dokumentierte Bücherkette keine Vorstufen',()=>{
    const colonial=BUILDINGS.filter(x=>x.dlc==='base'||x.dlc==='return-to-nature');
    const rows=goalRequirements('printing-house',1,'unknown',colonial,DEFAULT_SETTINGS,GOODS);
    expect(rows.map(x=>x.buildingId)).toEqual(['printing-house']);
    expect(rows[0].status).toBe('unknown');
  });

  it('lässt unbekannte Raten sichtbar unberechenbar',()=>{
    const result=calculate([entry('coconuts','coconut-harvester',1)]);
    expect(result.unknownEntries).toBe(1);
    const diagnostic=result.diagnostics.find(x=>x.title.includes('ohne belastbare Rate'))!;
    expect(diagnostic.items).toEqual(['1 × Kokosnussernter · Arbeitsmodus: Standard']);
  });

  it('berücksichtigt ausgewählte Verbesserungen bei Leistung und Arbeitsplätzen',()=>{
    const building={
      ...BUILDINGS.find((item)=>item.id==='plantation-sugar')!,
      workers:4,
      upgrades:[
        {id:'efficiency',name:'Effizienz',effectType:'efficiency' as const,effectValue:15,effectUnit:'percent' as const,description:'+15 % Effizienz',dataStatus:'verified' as const,source:'manual'},
        {id:'workers',name:'Arbeitsplätze',effectType:'workers' as const,effectValue:2,effectUnit:'workers' as const,description:'+2 Arbeitsplätze',dataStatus:'verified' as const,source:'manual'}
      ]
    };
    const upgraded=entry('sugar',building.id,1);
    (upgraded as Entry & {upgradeIds:string[]}).upgradeIds=['efficiency','workers'];

    const performance=calculateEntryPerformance({entry:upgraded,building,settings:DEFAULT_SETTINGS});
    const result=calculateScenario({scenario:scenario([upgraded]),buildings:[building],goods:GOODS,settings:DEFAULT_SETTINGS});

    expect(performance.outputs.sugar).toBe(10_350);
    expect(result.totalJobs).toBe(6);
  });

  it('zeigt für ein Produktionsziel vorhandene und noch zu bauende Gebäude',()=>{
    const plan=buildGoalPlan({
      buildingId:'rum-distillery',
      count:1,
      modeId:'dunder',
      buildings:BUILDINGS,
      settings:DEFAULT_SETTINGS,
      entries:[entry('sugar','plantation-sugar',1)],
      goods:GOODS
    });

    expect(plan.calculable).toBe(true);
    expect(plan.rows.map(row=>[row.buildingId,row.recommended,row.existing,row.missing])).toEqual([
      ['plantation-sugar',2,1,1],
      ['rum-distillery',1,0,1]
    ]);
    expect(plan.additionalWorkers).toBe(12);
  });

  it('zählt geplante Gebäude bereits gegen die Bauempfehlung',()=>{
    const plannedRum=entry('rum','rum-distillery',1,'dunder','planned');
    const plan=buildGoalPlan({buildingId:'rum-distillery',count:1,modeId:'dunder',buildings:BUILDINGS,settings:DEFAULT_SETTINGS,entries:[plannedRum],goods:GOODS});

    expect(plan.rows.find(row=>row.buildingId==='rum-distillery')).toEqual(expect.objectContaining({planned:1,missing:0}));
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
    expect(result.transportDemand).toBeCloseTo(38000);
    expect(result.requiredTeamsterOffices).toBe(7);
    expect(result.teamsterOfficeDifference).toBe(7);
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
