import { DEFAULT_SETTINGS } from './data';
import type { Database, Entry, Project, Scenario } from './types';

export const STORAGE_KEY='tropico6-production-planner-svelte-v1';
export const uid=(prefix:string)=>`${prefix}-${globalThis.crypto?.randomUUID?.()??Math.random().toString(36).slice(2)}`;

export function newEntry(buildingId='plantation-sugar',clusterId='cluster-main',status:Entry['status']='existing'):Entry {return {id:uid('entry'),clusterId,buildingId,modeId:'standard',count:1,efficiency:100,staffing:100,distance:'',status,note:'',rateOverrides:{inputs:{},outputs:{}}};}
export function newScenario(name='Ist-Stand',type:Scenario['type']='current'):Scenario {return {id:uid('scenario'),name,type,clusters:[{id:'cluster-main',name:'Hauptcluster',distance:''}],entries:[],policies:{}};}
export function newProject(name='Meine Kolonialinsel'):Project {const current=newScenario();return {id:uid('project'),name,dlcs:['base'],currentId:current.id,selectedId:current.id,scenarios:[current]};}
export function seed():Database {const project=newProject('Beispielinsel');project.dlcs=['base'];project.scenarios[0].entries=[newEntry('plantation-sugar','cluster-main'),newEntry('plantation-sugar','cluster-main'),newEntry('rum-distillery','cluster-main'),newEntry('teamster-office','cluster-main')];project.scenarios[0].entries[2].modeId='dunder';return {schema:2,projects:[project],activeProjectId:project.id,settings:{...DEFAULT_SETTINGS},updatedAt:new Date().toISOString()};}
export function load():Database {try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return seed();const parsed=JSON.parse(raw) as Database;if(parsed.schema!==2||!Array.isArray(parsed.projects))return seed();return {...parsed,settings:{...DEFAULT_SETTINGS,...parsed.settings}};}catch{return seed();}}
export function save(db:Database){db.updatedAt=new Date().toISOString();localStorage.setItem(STORAGE_KEY,JSON.stringify(db));}
export function cloneScenario(source:Scenario,name:string):Scenario {const copy=structuredClone(source);copy.id=uid('scenario');copy.name=name;copy.type='forecast';const map=new Map<string,string>();copy.clusters=copy.clusters.map(c=>{const id=uid('cluster');map.set(c.id,id);return {...c,id};});copy.entries=copy.entries.map(e=>({...e,id:uid('entry'),clusterId:map.get(e.clusterId)??copy.clusters[0].id,status:e.status==='existing'?'existing':'planned'}));return copy;}
