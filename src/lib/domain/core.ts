import type { Building, Scenario, Settings } from './types';

type Rates = Record<string, number>;
type Prepared = { entry: Scenario['entries'][number]; building: Building; mode: Building['modes'][number]; count:number; expectedFactor:number; theoreticalFactor:number; rates:{inputs:Rates;outputs:Rates}; calculable:boolean };

export const clamp = (value: unknown, min: number, max: number) => Math.min(max, Math.max(min, Number(value) || 0));
export const fmt = (value:number, digits=1) => Number(value || 0).toLocaleString('de-DE',{maximumFractionDigits:digits});

export function distanceFactor(entry: Prepared['entry'], scenario: Scenario) {
  const cluster = scenario.clusters.find((item) => item.id === entry.clusterId);
  const raw = entry.distance === '' ? cluster?.distance : entry.distance;
  return raw === '' || raw == null || Number.isNaN(Number(raw)) ? 1 : 1 + Math.max(0, Number(raw)) / 10;
}

function rates(entry:Prepared['entry'], mode:Building['modes'][number]) {
  const normalize=(source:Record<string,number|null>, overrides:Record<string,number|''>) => Object.fromEntries(Object.entries(source).map(([id,rate])=>[id,overrides[id] === '' || overrides[id] == null ? rate : Number(overrides[id])]));
  return {inputs:normalize(mode.inputs,entry.rateOverrides?.inputs ?? {}),outputs:normalize(mode.outputs,entry.rateOverrides?.outputs ?? {})};
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

export function calculateScenario({scenario,buildings,goods,settings}:{scenario:Scenario;buildings:Building[];goods:Record<string,{name:string}>;settings:Settings}) {
  const buildingMap=new Map(buildings.map(item=>[item.id,item]));
  const pool:Rates={}, produced:Rates={}, consumed:Rates={}, unmet:Rates={}, external:Rates={};
  const prepared:Prepared[]=[];
  let totalBuildings=0,plannedBuildings=0,totalJobs=0,filledJobs=0,unknownEntries=0,teamsterOffices=0,transportLoad=0;

  for(const [goodId,policy] of Object.entries(scenario.policies ?? {})) {
    const amount=Math.max(0,Number(policy.externalSupply)||0); pool[goodId]=(pool[goodId]??0)+amount; external[goodId]=amount;
  }
  for(const entry of scenario.entries.filter(e=>e.status!=='disabled'&&Number(e.count)>0)) {
    const building=buildingMap.get(entry.buildingId); if(!building) continue;
    const mode=building.modes.find(m=>m.id===entry.modeId)??building.modes[0];
    const count=Math.max(0,Number(entry.count)||0), efficiency=clamp(entry.efficiency,0,500)/100, staffing=clamp(entry.staffing,0,100)/100;
    const normalized=rates(entry,mode) as {inputs:Rates;outputs:Rates};
    const calculable=[...Object.values(normalized.inputs),...Object.values(normalized.outputs)].every(v=>v!=null&&Number.isFinite(Number(v)));
    totalBuildings+=count; if(entry.status==='planned') plannedBuildings+=count;
    totalJobs+=count*building.workers; filledJobs+=count*building.workers*staffing;
    if(building.kind==='teamster') teamsterOffices+=count;
    if(!calculable&&building.kind==='production') unknownEntries+=count;
    prepared.push({entry,building,mode,count,theoreticalFactor:count*building.workers*efficiency*staffing,expectedFactor:count*building.workers*efficiency*staffing*settings.worktimeFactor*settings.logisticsFactor,rates:normalized,calculable});
  }

  const entryResults: {entryId:string;buildingId:string;utilization:number;inputs:Rates;outputs:Rates;missing:Rates;calculable:boolean;theoreticalOutputs:Rates}[]=[];
  const stages=[...new Set(prepared.filter(x=>x.calculable).map(x=>x.building.stage))].sort((a,b)=>a-b);
  for(const stage of stages) {
    const group=prepared.filter(x=>x.calculable&&x.building.stage===stage), demand:Rates={};
    for(const item of group) for(const [good,rate] of Object.entries(item.rates.inputs)) demand[good]=(demand[good]??0)+rate*item.expectedFactor;
    const ratio:Rates={}; for(const [good,amount] of Object.entries(demand)) ratio[good]=amount<=0?1:Math.min(1,(pool[good]??0)/amount);
    for(const item of group) {
      let utilization=1; for(const good of Object.keys(item.rates.inputs)) utilization=Math.min(utilization,ratio[good]??1);
      const inputs:Rates={},outputs:Rates={},missing:Rates={},theoreticalOutputs:Rates={},distance=distanceFactor(item.entry,scenario);
      for(const [good,rate] of Object.entries(item.rates.inputs)) {const full=rate*item.expectedFactor,actual=full*utilization;pool[good]=Math.max(0,(pool[good]??0)-actual);consumed[good]=(consumed[good]??0)+actual;unmet[good]=(unmet[good]??0)+full-actual;inputs[good]=actual;missing[good]=full-actual;transportLoad+=actual*distance;}
      for(const [good,rate] of Object.entries(item.rates.outputs)) {const actual=rate*item.expectedFactor*utilization;pool[good]=(pool[good]??0)+actual;produced[good]=(produced[good]??0)+actual;outputs[good]=actual;theoreticalOutputs[good]=rate*item.theoreticalFactor;transportLoad+=actual*distance;}
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
  const recommendedMin=transportLoad?Math.ceil(transportLoad/Math.max(1,settings.transportCapacityHigh)):0,recommendedMax=transportLoad?Math.ceil(transportLoad/Math.max(1,settings.transportCapacityLow)):0;
  const diagnostics:{severity:'success'|'warning'|'error';title:string;detail:string;action?:string}[]=[];
  for(const chain of chainSummaries.filter(x=>x.utilization<.999)) diagnostics.push({severity:'error',title:`${chain.buildingName} nur zu ${Math.round(chain.utilization*100)} % versorgt`,detail:chain.inputs.filter(x=>x.missing>.01).map(x=>`${goods[x.goodId]?.name??x.goodId}: ${fmt(x.missing)}`).join(' · '),action:'Rohstoffproduktion erhöhen'});
  const openJobs=Math.max(0,totalJobs-filledJobs); if(openJobs>.01) diagnostics.push({severity:'warning',title:`${fmt(openJobs)} offene Arbeitsplätze`,detail:'Die Besetzung reduziert die erwartete Produktion.',action:'Besetzung prüfen'});
  if(unknownEntries) diagnostics.push({severity:'warning',title:`${fmt(unknownEntries,0)} Gebäude ohne belastbare Rate`,detail:'Eigene Messwerte können direkt beim Gebäude eingetragen werden.',action:'Werte ergänzen'});
  if(transportLoad&&teamsterOffices<recommendedMin) diagnostics.push({severity:'warning',title:'Transportkapazität wahrscheinlich knapp',detail:`${teamsterOffices} vorhanden; grob ${recommendedMin}–${recommendedMax} empfohlen.`,action:'Transportbüro einplanen'});
  if(!diagnostics.length) diagnostics.push({severity:'success',title:'Produktion rechnerisch stabil',detail:'Unter den gewählten Annahmen ist kein direkter Engpass erkennbar.'});
  return {totalBuildings,plannedBuildings,totalJobs,filledJobs,openJobs,teamsterOffices,transportLoad,recommendedMin,recommendedMax,unknownEntries,balances,chainSummaries,diagnostics,entryResults,suppliedChains:chainSummaries.filter(x=>x.utilization>=.999).length,totalChains:chainSummaries.length,topExports:balances.filter(x=>x.exportable>.01).sort((a,b)=>b.exportable-a.exportable).slice(0,5)};
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

export function compareResults(current:ReturnType<typeof calculateScenario>,forecast:ReturnType<typeof calculateScenario>) {return {totalBuildings:forecast.totalBuildings-current.totalBuildings,totalJobs:forecast.totalJobs-current.totalJobs,openJobs:forecast.openJobs-current.openJobs,transportLoad:forecast.transportLoad-current.transportLoad,suppliedChains:forecast.suppliedChains-current.suppliedChains};}
