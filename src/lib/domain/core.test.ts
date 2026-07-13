import { describe, expect, it } from 'vitest';
import { BUILDINGS, DEFAULT_SETTINGS, GOODS } from './data';
import { calculateScenario, goalRequirements } from './core';
import type { Entry, Scenario } from './types';

const entry=(id:string,buildingId:string,count:number,modeId='standard',status:Entry['status']='existing'):Entry=>({id,clusterId:'main',buildingId,modeId,count,efficiency:100,staffing:100,distance:'',status,note:'',rateOverrides:{inputs:{},outputs:{}}});
const scenario=(entries:Entry[]):Scenario=>({id:'test',name:'Test',type:'current',clusters:[{id:'main',name:'Hauptcluster',distance:''}],entries,policies:{}});
const calculate=(entries:Entry[])=>calculateScenario({scenario:scenario(entries),buildings:BUILDINGS,goods:GOODS,settings:DEFAULT_SETTINGS});

describe('Kolonialzeit-Berechnung',()=>{
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
    expect(result.diagnostics.some(x=>x.title.includes('ohne belastbare Rate'))).toBe(true);
  });
});
