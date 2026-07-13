import type { Building, Era, Settings } from './types';

export const ERAS: { id: Era; name: string; loadPerTrip: number }[] = [
  {id:'colonial',name:'Kolonialzeit',loadPerTrip:500},
  {id:'world-wars',name:'Weltkriege',loadPerTrip:800},
  {id:'cold-war',name:'Kalter Krieg',loadPerTrip:800},
  {id:'modern',name:'Moderne',loadPerTrip:1200}
];

const ERA_ORDER: Era[] = ERAS.map(era=>era.id);
export const buildingAvailableInEra = (building: Building, era: Era) => ERA_ORDER.indexOf(building.availableFrom??'colonial')<=ERA_ORDER.indexOf(era);

export const GOODS: Record<string, { name: string; icon: string }> = {
  banana:{name:'Bananen',icon:'🍌'}, cocoa:{name:'Kakao',icon:'🫘'}, coffee:{name:'Kaffee',icon:'☕'}, corn:{name:'Mais',icon:'🌽'}, cotton:{name:'Baumwolle',icon:'☁️'},
  pineapple:{name:'Ananas',icon:'🍍'}, rubber:{name:'Kautschuk',icon:'🌿'}, sugar:{name:'Zucker',icon:'🧊'}, tobacco:{name:'Tabak',icon:'🍂'}, coconut:{name:'Kokosnüsse',icon:'🥥'},
  fish:{name:'Fisch',icon:'🐟'}, shellfish:{name:'Schalentiere',icon:'🦐'}, logs:{name:'Holzstämme',icon:'🪵'}, coal:{name:'Kohle',icon:'⬛'}, gold:{name:'Gold',icon:'🟨'}, iron:{name:'Eisen',icon:'⛏️'},
  pearls:{name:'Perlen',icon:'⚪'}, meat:{name:'Fleisch',icon:'🥩'}, hides:{name:'Häute',icon:'🟫'}, wool:{name:'Wolle',icon:'🐑'}, milk:{name:'Milch',icon:'🥛'},
  planks:{name:'Bretter',icon:'🪚'}, rum:{name:'Rum',icon:'🍾'}, leather:{name:'Leder',icon:'👢'}, paper:{name:'Papier',icon:'📄'}, books:{name:'Bücher',icon:'📚'}, toys:{name:'Spielzeug',icon:'🧸'}, fireworks:{name:'Feuerwerk',icon:'🎆'}
};

export const DLCS = [
  {id:'base',name:'Grundspiel',description:'Alle regulären Produktionsgebäude der Kolonialzeit'},
  {id:'llama',name:'The Llama of Wall Street',description:'Spielzeugwerkstatt'},
  {id:'festival',name:'Festival',description:'Feuerwerksfabrik'},
  {id:'tropican-shores',name:'Tropican Shores',description:'Perlentaucher'},
  {id:'return-to-nature',name:'Return to Nature',description:'Imkerei, Köhlerei, Papiermühle und Druckerei'}
];

const verified = 'Steam-Guide „Industry Profits“: Messwerte je Arbeiter-Arbeitstag bei 100 % Effizienz';
const estimated = 'Community-Nachmessung; als Schätzwert gekennzeichnet und überschreibbar';
const raw = (id:string,name:string,icon:string,output:string,rate:number|null,workers:number,category:string,dlc='base',dataStatus:Building['dataStatus']='verified',source=verified):Building => ({
  id,name,icon,category,dlc,workers,education:'uneducated',kind:'production',stage:0,dataStatus,source,modes:[{id:'standard',name:'Standard',inputs:{},outputs:{[output]:rate}}]
});

export const BUILDINGS: Building[] = [
  raw('plantation-banana','Bananenplantage','🍌','banana',2.5,8,'Plantagen'), raw('plantation-cocoa','Kakaoplantage','🫘','cocoa',1,8,'Plantagen'),
  raw('plantation-coffee','Kaffeeplantage','☕','coffee',1,8,'Plantagen'), raw('plantation-corn','Maisplantage','🌽','corn',2,8,'Plantagen'),
  raw('plantation-cotton','Baumwollplantage','☁️','cotton',3.5,8,'Plantagen'), raw('plantation-pineapple','Ananasplantage','🍍','pineapple',2.5,8,'Plantagen'),
  raw('plantation-rubber','Kautschukplantage','🌿','rubber',1.2,8,'Plantagen'), raw('plantation-sugar','Zuckerplantage','🧊','sugar',1.5,8,'Plantagen'),
  raw('plantation-tobacco','Tabakplantage','🍂','tobacco',1.8,8,'Plantagen'),
  {id:'ranch-cattle',name:'Rinderfarm',icon:'🐄',category:'Farmen',dlc:'base',workers:4,education:'uneducated',kind:'production',stage:0,dataStatus:'verified',source:verified,modes:[{id:'cattle',name:'Rinder',inputs:{},outputs:{meat:1.5,hides:2}}]},
  {id:'ranch-sheep',name:'Schaffarm',icon:'🐑',category:'Farmen',dlc:'base',workers:4,education:'uneducated',kind:'production',stage:0,dataStatus:'verified',source:verified,modes:[{id:'sheep',name:'Schafe',inputs:{},outputs:{wool:1.5,milk:.5}}]},
  raw('ranch-crocodile','Krokodilfarm','🐊','leather',.8,4,'Farmen'), raw('ranch-pig','Schweinefarm','🐖','meat',2,4,'Farmen'),
  raw('ranch-llama','Lamafarm','🦙','wool',2,4,'Farmen'), raw('ranch-goat','Ziegenfarm','🐐','milk',2,4,'Farmen'),
  raw('mine-coal','Kohlemine','⬛','coal',2,5,'Minen'), raw('mine-iron','Eisenmine','⛏️','iron',2,5,'Minen'), raw('mine-gold','Goldmine','🟨','gold',.6,5,'Minen'),
  raw('logging-camp','Holzfällerlager','🪵','logs',1.3333333333,6,'Rohstoffgewinnung','base','estimated','Kalibrierwert: zwei Lager versorgen ungefähr ein normales Sägewerk'),
  raw('coconut-harvester','Kokosnussernter','🥥','coconut',null,6,'Rohstoffgewinnung','base','unknown','Produktionsbeziehung bekannt; Rate muss individuell kalibriert werden'),
  {id:'fishermen-wharf',name:'Fischereihafen',icon:'🐟',category:'Rohstoffgewinnung',dlc:'base',workers:5,education:'uneducated',kind:'production',stage:0,dataStatus:'unknown',source:'Produktionsbeziehung bekannt; Rate muss individuell kalibriert werden',modes:[{id:'fish',name:'Fisch',inputs:{},outputs:{fish:null}},{id:'shellfish',name:'Schalentiere',inputs:{},outputs:{shellfish:null}}]},
  {id:'lumber-mill',name:'Sägewerk',icon:'🪚',category:'Industrie',dlc:'base',workers:4,education:'uneducated',kind:'production',stage:1,dataStatus:'verified',source:verified,modes:[{id:'normal',name:'Normalbetrieb',inputs:{logs:4},outputs:{planks:10}},{id:'hasty',name:'Schnelles Entrinden',inputs:{logs:6.8},outputs:{planks:13}}]},
  {id:'rum-distillery',name:'Rumdestillerie',icon:'🍾',category:'Industrie',dlc:'base',workers:4,education:'uneducated',kind:'production',stage:1,dataStatus:'verified',source:verified,modes:[{id:'normal',name:'Normalbetrieb',inputs:{sugar:6.8},outputs:{rum:3.5}},{id:'dunder',name:'Dunder-Destille',inputs:{sugar:5.1},outputs:{rum:3.5}}]},
  {id:'tannery',name:'Gerberei',icon:'👢',category:'Industrie',dlc:'base',workers:5,education:'uneducated',kind:'production',stage:1,dataStatus:'verified',source:verified,modes:[{id:'normal',name:'Normalbetrieb',inputs:{hides:3.65},outputs:{leather:1.825}},{id:'chrome',name:'Chromgerbung',inputs:{hides:2.725},outputs:{leather:1.825}}]},
  {id:'toy-workshop',name:'Spielzeugwerkstatt',icon:'🧸',category:'DLC-Industrie',dlc:'llama',workers:5,education:'uneducated',kind:'production',stage:1,dataStatus:'unknown',source:'Inputvarianten bekannt; Mengen müssen individuell kalibriert werden',modes:[{id:'wood',name:'Holzspielzeug',inputs:{logs:null},outputs:{toys:null}},{id:'cotton',name:'Stoffspielzeug',inputs:{cotton:null},outputs:{toys:null}},{id:'rubber',name:'Gummispielzeug',inputs:{rubber:null},outputs:{toys:null}}]},
  {id:'fireworks-factory',name:'Feuerwerksfabrik',icon:'🎆',category:'DLC-Industrie',dlc:'festival',workers:5,education:'uneducated',kind:'production',stage:1,dataStatus:'unknown',source:'Vier Inputvarianten sind bestätigt; Mengen müssen individuell kalibriert werden',modes:[{id:'coconut-logs',name:'Kokosnüsse und Holz',inputs:{coconut:null,logs:null},outputs:{fireworks:null}},{id:'coconut-corn',name:'Kokosnüsse und Mais',inputs:{coconut:null,corn:null},outputs:{fireworks:null}},{id:'coal-logs',name:'Kohle und Holz',inputs:{coal:null,logs:null},outputs:{fireworks:null}},{id:'coal-corn',name:'Kohle und Mais',inputs:{coal:null,corn:null},outputs:{fireworks:null}}]},
  raw('pearl-divers','Perlentaucher','⚪','pearls',.8,6,'DLC-Rohstoffgewinnung','tropican-shores','estimated',estimated),
  raw('beekeeper','Imkerei','🐝','sugar',1.5,4,'DLC-Rohstoffgewinnung','return-to-nature','estimated',estimated),
  {id:'charcoal-burner',name:'Köhlerei',icon:'🔥',category:'DLC-Industrie',dlc:'return-to-nature',workers:4,education:'uneducated',kind:'production',stage:1,dataStatus:'estimated',source:estimated,modes:[{id:'normal',name:'Normalbetrieb',inputs:{logs:3.2},outputs:{coal:7}}]},
  {id:'paper-mill',name:'Papiermühle',icon:'📄',category:'DLC-Industrie',dlc:'return-to-nature',workers:5,education:'uneducated',kind:'production',stage:1,dataStatus:'estimated',source:estimated,modes:[{id:'logs',name:'Holzstämme',inputs:{logs:4},outputs:{paper:10}},{id:'coconut',name:'Kokosnüsse',inputs:{coconut:3.66},outputs:{paper:10}},{id:'cotton',name:'Baumwolle',inputs:{cotton:4.5},outputs:{paper:10}},{id:'wool',name:'Wolle',inputs:{wool:2.5},outputs:{paper:10}}]},
  {id:'printing-house',name:'Druckerei',icon:'📚',category:'DLC-Industrie',dlc:'return-to-nature',workers:5,education:'uneducated',kind:'production',stage:2,dataStatus:'estimated',source:estimated,modes:[{id:'paper',name:'Papierausgabe',inputs:{paper:10.8},outputs:{books:4}},{id:'leather',name:'Ledereinband',inputs:{paper:6,leather:2},outputs:{books:4}}]},
  {id:'teamster-office',name:'Transportbüro',icon:'🐎',category:'Logistik',dlc:'base',workers:6,education:'uneducated',kind:'teamster',stage:99,dataStatus:'model',source:'Kapazitätsmodell mit 500 Einheiten je Fahrt und angenommener Fahrtenzahl',modes:[{id:'standard',name:'Sichere Ladung',inputs:{},outputs:{}},{id:'loose-load',name:'Lockere Ladegrenzen',inputs:{},outputs:{}}]}
];

export const DEFAULT_SETTINGS: Settings = {tooltips:true,compact:false,profile:'realistic',worktimeFactor:.8,logisticsFactor:.9,transportTripsPerWorker:2};

export const PROFILES = {
  optimistic:{name:'Optimistisch',worktimeFactor:.95,logisticsFactor:.98,description:'Kurze Wege und zuverlässige Abholung'},
  realistic:{name:'Realistisch',worktimeFactor:.8,logisticsFactor:.9,description:'Normale Wege und gelegentliche Verzögerungen'},
  difficult:{name:'Schlechte Anbindung',worktimeFactor:.65,logisticsFactor:.75,description:'Lange Wege und häufige Transportprobleme'},
  custom:{name:'Benutzerdefiniert',worktimeFactor:1,logisticsFactor:1,description:'Eigene Annahmen verwenden'}
};
