import type { Building, Era, Entry, Scenario, Settings } from './types';

type Rates = Record<string, number>;
type Prepared = { entry: Scenario['entries'][number]; building: Building; mode: Building['modes'][number]; count:number; expectedFactor:number; theoreticalFactor:number; rates:{inputs:Rates;outputs:Rates}; calculable:boolean };

export const clamp = (value: unknown, min: number, max: number) => Math.min(max, Math.max(min, Number(value) || 0));
export const fmt = (value:number, digits=1) => Number(value || 0).toLocaleString('de-DE',{maximumFractionDigits:digits});

const LOAD_PER_TRIP_BY_ERA: Record<Era, number> = {colonial:500,'world-wars':800,'cold-war':800,modern:1200};
const TEAMSTER_MODE_FACTORS: Record<string, number> = { standard: 1, 'loose-load': 1.35 };

export function distanceFactor(entry: Prepared['entry'], scenario: Scenario) {
  const cluster = scenario.clusters.find((item) => item.id === entry.clusterId);
  const raw = entry.distance === '' ? cluster?.distance : entry.distance;
  return raw === '' || raw == null || Number.isNaN(Number(raw)) ? 1 : 1 + Math.max(0, Number(raw)) / 10;
}

function rates(entry:Prepared['entry'], mode:Building['modes'][number]) {
  const normalize=(source:Record<string,number|null>, overrides:Record<string,number|''>) => Object.fromEntries(Object.entries(source).map(([id,rate])=>[id,overrides[id] === '' || overrides[id] == null ? rate : Number(overrides[id])]));
  return {inputs:normalize(mode.inputs,entry.rateOverrides?.inputs ?? {}),outputs:normalize(mode.outputs,entry.rateOverrides?.outputs ?? {})};
}

export function calculateEntryPerformance({entry,building,era='colonial',settings}:{entry:Entry;building:Building;era?:Era;settings:Settings}) {
  const mode=building.modes.find(item=>item.id===entry.modeId)??building.modes[0];
  const normalized=rates(entry,mode);
  const calculable=[...Object.values(normalized.inputs),...Object.values(normalized.outputs)].every(value=>value!=null&&Number.isFinite(Number(value)));
  const count=Math.max(0,Number(entry.count)||0);
  const efficiency=clamp(entry.efficiency,0,500)/100;
  const factor=count*building.workers*efficiency;
  const scale=(source:Record<string,number|null>)=>Object.fromEntries(Object.entries(source).map(([id,value])=>[id,Number(value)*factor])) as Rates;
  const inputs=calculable?scale(normalized.inputs):{};
  const outputs=calculable?scale(normalized.outputs):{};
  const staffing=clamp(entry.staffing,0,100)/100;
  const transportCapacity=building.kind==='teamster'
    ? count*building.workers*staffing*LOAD_PER_TRIP_BY_ERA[era]*efficiency*(TEAMSTER_MODE_FACTORS[mode.id]??1)*Math.max(0,settings.transportTripsPerWorker)
    : 0;
  return {mode,calculable,inputs,outputs,transportCapacity,loadPerTrip:LOAD_PER_TRIP_BY_ERA[era],modeFactor:TEAMSTER_MODE_FACTORS[mode.id]??1};
}

function bestSource(buildings:Building[], goodId:string) {
  const choices = buildings.flatMap(building => building.kind === 'production' && building.stage === 0 ? building.modes.flatMap(mode => {
    const rate=mode.outputs[goodId];
    return rate && rate>0 ? [{buildingId:building.id,name:building.name,icon:building.icon,dlc:building.dlc,outputPerBuilding:rate*building.workers}] : [];
  }) : []);
  return choices.sort((a,b)=>(a.dlc==='base'?-100:0)+a.outputPerBuilding*-1-((b.dlc==='base'?-100:0)+b.outputPerBuilding*-1))[0] ?? null;
}

function bestProducer(buildings:Building[],goodId:string) {
  const choices=buildings.flatMap(building=>building.kind==='production'?building.modes.flatMap(mode=>{
    const rate=mode.outputs[goodId];
    return rate&&rate>0?[{buildingId:building.id,name:building.name,icon:building.icon,dlc:building.dlc,stage:building.stage,modeId:mode.id,outputPerBuilding:rate*building.workers}]:[];
  }):[]);
  return choices.sort((a,b)=>(a.dlc==='base'?0:1)-(b.dlc==='base'?0:1)||a.stage-b.stage||b.outputPerBuilding-a.outputPerBuilding)[0]??null;
}

export function calculateScenario({scenario,buildings,goods,settings,era='colonial'}:{scenario:Scenario;buildings:Building[];goods:Record<string,{name:string}>;settings:Settings;era?:Era}) {
  const buildingMap=new Map(buildings.map(item=>[item.id,item]));
  const pool:Rates={}, produced:Rates={}, consumed:Rates={}, unmet:Rates={}, external:Rates={};
  const prepared:Prepared[]=[];
  let totalBuildings=0,plannedBuildings=0,totalJobs=0,filledJobs=0,unknownEntries=0,teamsterOffices=0,transportDemand=0,transportCapacity=0;
  const educationJobs:Record<string,number>={'uneducated':0,'high-school':0,'college':0};
  const educationFilled:Record<string,number>={'uneducated':0,'high-school':0,'college':0};

  for(const [goodId,policy] of Object.entries(scenario.policies ?? {})) {
    const amount=Math.max(0,Number(policy.externalSupply)||0); pool[goodId]=(pool[goodId]??0)+amount; external[goodId]=amount; transportDemand+=amount;
  }
  for(const entry of scenario.entries.filter(e=>e.status!=='disabled'&&Number(e.count)>0)) {
    const building=buildingMap.get(entry.buildingId); if(!building) continue;
    const mode=building.modes.find(m=>m.id===entry.modeId)??building.modes[0];
    const count=Math.max(0,Number(entry.count)||0), efficiency=clamp(entry.efficiency,0,500)/100, staffing=clamp(entry.staffing,0,100)/100;
    const normalized=rates(entry,mode) as {inputs:Rates;outputs:Rates};
    const calculable=[...Object.values(normalized.inputs),...Object.values(normalized.outputs)].every(v=>v!=null&&Number.isFinite(Number(v)));
    const performance=calculateEntryPerformance({entry,building,era,settings});
    totalBuildings+=count; if(entry.status==='planned') plannedBuildings+=count;
    totalJobs+=count*building.workers; filledJobs+=count*building.workers*staffing;
    educationJobs[building.education]=(educationJobs[building.education]??0)+count*building.workers;
    educationFilled[building.education]=(educationFilled[building.education]??0)+count*building.workers*staffing;
    if(building.kind==='teamster') {
      teamsterOffices+=count;
      transportCapacity+=performance.transportCapacity;
    }
    if(building.kind==='production'&&performance.calculable) transportDemand+=Object.values(performance.outputs).reduce((sum,value)=>sum+value,0);
    if(!calculable&&building.kind==='production') unknownEntries+=count;
    prepared.push({entry,building,mode,count,theoreticalFactor:count*building.workers*efficiency,expectedFactor:count*building.workers*efficiency*staffing*settings.worktimeFactor*settings.logisticsFactor,rates:normalized,calculable});
  }

  const entryResults: {entryId:string;buildingId:string;utilization:number;inputs:Rates;outputs:Rates;missing:Rates;calculable:boolean;theoreticalOutputs:Rates}[]=[];
  const stages=[...new Set(prepared.filter(x=>x.calculable).map(x=>x.building.stage))].sort((a,b)=>a-b);
  for(const stage of stages) {
    const group=prepared.filter(x=>x.calculable&&x.building.stage===stage), demand:Rates={};
    for(const item of group) for(const [good,rate] of Object.entries(item.rates.inputs)) demand[good]=(demand[good]??0)+rate*item.expectedFactor;
    const ratio:Rates={}; for(const [good,amount] of Object.entries(demand)) ratio[good]=amount<=0?1:Math.min(1,(pool[good]??0)/amount);
    for(const item of group) {
      let utilization=1; for(const good of Object.keys(item.rates.inputs)) utilization=Math.min(utilization,ratio[good]??1);
      const inputs:Rates={},outputs:Rates={},missing:Rates={},theoreticalOutputs:Rates={};
      for(const [good,rate] of Object.entries(item.rates.inputs)) {const full=rate*item.expectedFactor,actual=full*utilization;pool[good]=Math.max(0,(pool[good]??0)-actual);consumed[good]=(consumed[good]??0)+actual;unmet[good]=(unmet[good]??0)+full-actual;inputs[good]=actual;missing[good]=full-actual;}
      for(const [good,rate] of Object.entries(item.rates.outputs)) {const actual=rate*item.expectedFactor*utilization;pool[good]=(pool[good]??0)+actual;produced[good]=(produced[good]??0)+actual;outputs[good]=actual;theoreticalOutputs[good]=rate*item.theoreticalFactor;}
      entryResults.push({entryId:item.entry.id,buildingId:item.building.id,utilization,inputs,outputs,missing,calculable:true,theoreticalOutputs});
    }
  }
  for(const item of prepared.filter(x=>!x.calculable)) entryResults.push({entryId:item.entry.id,buildingId:item.building.id,utilization:0,inputs:{},outputs:{},missing:{},calculable:false,theoreticalOutputs:{}});

  const relevant=new Set([...Object.keys(produced),...Object.keys(consumed),...Object.keys(external),...Object.keys(scenario.policies??{})]);
  const balances=[...relevant].map(goodId=>{const policy=scenario.policies?.[goodId]??{externalSupply:0,reserve:0,exportEnabled:true};const leftover=Math.max(0,pool[goodId]??0),reserveTarget=Math.max(0,Number(policy.reserve)||0);return {goodId,produced:produced[goodId]??0,external:external[goodId]??0,consumed:consumed[goodId]??0,unmet:unmet[goodId]??0,leftover,reserveTarget,exportable:policy.exportEnabled===false?0:Math.max(0,leftover-reserveTarget),exportEnabled:policy.exportEnabled!==false};}).sort((a,b)=>(goods[a.goodId]?.name??a.goodId).localeCompare(goods[b.goodId]?.name??b.goodId,'de'));
  const resultMap=new Map(entryResults.map(x=>[x.entryId,x])), balanceMap=new Map(balances.map(x=>[x.goodId,x]));
  const chainSummaries=prepared.filter(x=>x.calculable&&Object.keys(x.rates.inputs).length).map(item=>{
    const result=resultMap.get(item.entry.id)!;
    const inputs=Object.entries(item.rates.inputs).map(([goodId,rate])=>{const leftover=balanceMap.get(goodId)?.leftover??0,perBuildingDemand=rate*(item.expectedFactor/item.count),missingForOne=Math.max(0,perBuildingDemand-leftover),source=bestSource(buildings,goodId),expectedSourceOutput=source?source.outputPerBuilding*settings.worktimeFactor*settings.logisticsFactor:0;return {goodId,demand:rate*item.expectedFactor,actual:result.inputs[goodId]??0,missing:result.missing[goodId]??0,leftover,perBuildingDemand,missingForOne,source,suggestedSourceCount:expectedSourceOutput>0?Math.ceil(missingForOne/expectedSourceOutput):null};});
    const extraExact=inputs.length?Math.min(...inputs.map(i=>i.perBuildingDemand?i.leftover/i.perBuildingDemand:0)):0;
    return {entryId:item.entry.id,buildingId:item.building.id,buildingName:item.building.name,modeName:item.mode.name,count:item.count,utilization:result.utilization,inputs,outputs:Object.entries(result.outputs).map(([goodId,amount])=>({goodId,amount})),additionalWholeBuildings:Math.max(0,Math.floor(extraExact+1e-9))};
  });
  const transportDifference=transportCapacity-transportDemand;
  const transportUtilization=transportCapacity>0?transportDemand/transportCapacity*100:null;
  const referenceOfficeCapacity=6*LOAD_PER_TRIP_BY_ERA[era]*Math.max(0,settings.transportTripsPerWorker);
  const requiredTeamsterOffices=transportDemand>0&&referenceOfficeCapacity>0?Math.ceil(transportDemand/referenceOfficeCapacity):0;
  const teamsterOfficeDifference=requiredTeamsterOffices-teamsterOffices;
  const diagnostics:{severity:'success'|'warning'|'error';title:string;detail:string;items?:string[];action?:string}[]=[];
  for(const chain of chainSummaries.filter(x=>x.utilization<.999)) diagnostics.push({severity:'error',title:`${chain.buildingName} nur zu ${Math.round(chain.utilization*100)} % versorgt`,detail:chain.inputs.filter(x=>x.missing>.01).map(x=>`${goods[x.goodId]?.name??x.goodId}: ${fmt(x.missing)}`).join(' · '),action:'Rohstoffproduktion erhöhen'});
  const openJobs=Math.max(0,totalJobs-filledJobs); if(openJobs>.01) diagnostics.push({severity:'warning',title:`${fmt(openJobs)} offene Arbeitsplätze`,detail:'Die Besetzung reduziert die erwartete Produktion.',action:'Besetzung prüfen'});
  if(unknownEntries) {
    const groupedUnknown=new Map<string,{name:string;modeName:string;count:number}>();
    for(const item of prepared.filter(x=>!x.calculable&&x.building.kind==='production')) {
      const key=`${item.building.id}:${item.mode.id}`;
      const existing=groupedUnknown.get(key);
      if(existing) existing.count+=item.count;
      else groupedUnknown.set(key,{name:item.building.name,modeName:item.mode.name,count:item.count});
    }
    diagnostics.push({
      severity:'warning',
      title:`${fmt(unknownEntries,0)} Gebäude ohne belastbare Rate`,
      detail:'Für diese Gebäude fehlen noch Produktions- oder Verbrauchsmengen:',
      items:[...groupedUnknown.values()].map(item=>`${fmt(item.count,0)} × ${item.name} · Arbeitsmodus: ${item.modeName}`),
      action:'Produktionswerte später ergänzen'
    });
  }
  if(teamsterOfficeDifference>0) diagnostics.push({severity:'warning',title:'Transportkapazität theoretisch zu niedrig',detail:`Im Standardmodell werden ${teamsterOfficeDifference} weitere Transportbüros benötigt.`,action:'Transportbüro einplanen'});
  if(!diagnostics.length) diagnostics.push({severity:'success',title:'Produktion rechnerisch stabil',detail:'Unter den gewählten Annahmen ist kein direkter Engpass erkennbar.'});
  return {totalBuildings,plannedBuildings,totalJobs,filledJobs,openJobs,educationJobs,educationFilled,teamsterOffices,transportDemand,transportCapacity,transportDifference,transportUtilization,requiredTeamsterOffices,teamsterOfficeDifference,unknownEntries,balances,chainSummaries,diagnostics,entryResults,suppliedChains:chainSummaries.filter(x=>x.utilization>=.999).length,totalChains:chainSummaries.length,topExports:balances.filter(x=>x.exportable>.01).sort((a,b)=>b.exportable-a.exportable).slice(0,5)};
}

export function goalRequirements(buildingId:string,count:number,modeId:string,buildings:Building[],settings:Settings,goods:Record<string,{name:string}>={}) {
  const rows:{buildingId:string;name:string;icon:string;exact:number;recommended:number;reason:string;level:number;status:string}[]=[];
  const visit=(id:string,amount:number,selectedMode:string|undefined,level:number,reason:string)=>{
    const building=buildings.find(b=>b.id===id); if(!building||level>6) return;
    const mode=building.modes.find(m=>m.id===selectedMode)??building.modes[0];
    rows.push({buildingId:id,name:building.name,icon:building.icon,exact:amount,recommended:Math.ceil(amount),reason,level,status:building.dataStatus});
    const factor=building.workers*settings.worktimeFactor*settings.logisticsFactor;
    for(const [good,inputRate] of Object.entries(mode.inputs)) {
      if(inputRate==null) continue;
      const source=bestProducer(buildings,good); if(!source) continue;
      const needed=inputRate*factor*amount;
      const expectedSourceOutput=source.outputPerBuilding*settings.worktimeFactor*settings.logisticsFactor;
      visit(source.buildingId,needed/expectedSourceOutput,source.modeId,level+1,`${needed.toFixed(1)} Einheiten ${goods[good]?.name??good} benötigt`);
    }
  };
  visit(buildingId,Math.max(0,count),modeId,0,'Produktionsziel');
  return rows.reverse();
}

export function compareResults(current:ReturnType<typeof calculateScenario>,forecast:ReturnType<typeof calculateScenario>) {return {totalBuildings:forecast.totalBuildings-current.totalBuildings,totalJobs:forecast.totalJobs-current.totalJobs,openJobs:forecast.openJobs-current.openJobs,transportDemand:forecast.transportDemand-current.transportDemand,suppliedChains:forecast.suppliedChains-current.suppliedChains};}
