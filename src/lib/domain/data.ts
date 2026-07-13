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
  planks:{name:'Bretter',icon:'🪚'}, rum:{name:'Rum',icon:'🍾'}, leather:{name:'Leder',icon:'👢'}, paper:{name:'Papier',icon:'📄'}, books:{name:'Bücher',icon:'📚'}, toys:{name:'Spielzeug',icon:'🧸'}, fireworks:{name:'Feuerwerk',icon:'🎆'},
  oil:{name:'Öl',icon:'🛢️'}, nickel:{name:'Nickel',icon:'◆'}, aluminium:{name:'Aluminium',icon:'◇'}, uranium:{name:'Uran',icon:'☢'},
  canned:{name:'Konserven',icon:'🥫'}, cheese:{name:'Käse',icon:'🧀'}, cigars:{name:'Zigarren',icon:'▰'}, boats:{name:'Boote',icon:'⛵'}, steel:{name:'Stahl',icon:'⚙'}, cloth:{name:'Stoff',icon:'🧵'}, weapons:{name:'Waffen',icon:'⚔'},
  chocolate:{name:'Schokolade',icon:'🍫'}, furniture:{name:'Möbel',icon:'🪑'}, jewelry:{name:'Schmuck',icon:'💎'}, plastics:{name:'Kunststoff',icon:'◉'}, cars:{name:'Autos',icon:'🚗'},
  electronics:{name:'Elektronik',icon:'▣'}, apparel:{name:'Kleidung',icon:'👕'}, pharmaceuticals:{name:'Medikamente',icon:'⚕'}, juice:{name:'Saft',icon:'🧃'}, smartFurniture:{name:'Smart-Möbel',icon:'▤'}, balloons:{name:'Ballons',icon:'🎈'}, yachts:{name:'Yachten',icon:'🛥️'}
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

const pending = (id:string,name:string,workers:number,education:Building['education'],availableFrom:NonNullable<Building['availableFrom']>,stage:number,modes:Building['modes'],dlc='base'):Building => ({
  id,name,icon:'•',category:stage===0?'Rohstoffgewinnung':'Industrie',dlc,workers,education,kind:'production',stage,availableFrom,dataStatus:'unknown',source:'Tropico Wiki: Gebäude, Zeitalter und Arbeitsplätze bestätigt; Produktionsraten noch offen',modes
});
const pendingMode = (id:string,name:string,inputs:string[],outputs:string[]):Building['modes'][number] => ({id,name,inputs:Object.fromEntries(inputs.map(good=>[good,null])),outputs:Object.fromEntries(outputs.map(good=>[good,null]))});

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
  {id:'toy-workshop',name:'Spielzeugwerkstatt',icon:'🧸',category:'DLC-Industrie',dlc:'llama',workers:4,education:'uneducated',kind:'production',stage:1,dataStatus:'unknown',source:'Inputvarianten bekannt; Mengen müssen individuell kalibriert werden',modes:[{id:'wood',name:'Holzspielzeug',inputs:{logs:null},outputs:{toys:null}},{id:'cotton',name:'Stoffspielzeug',inputs:{cotton:null},outputs:{toys:null}},{id:'rubber',name:'Gummispielzeug',inputs:{rubber:null},outputs:{toys:null}}]},
  {id:'fireworks-factory',name:'Feuerwerksfabrik',icon:'🎆',category:'DLC-Industrie',dlc:'festival',workers:4,education:'uneducated',kind:'production',stage:1,dataStatus:'unknown',source:'Vier Inputvarianten sind bestätigt; Mengen müssen individuell kalibriert werden',modes:[{id:'coconut-logs',name:'Kokosnüsse und Holz',inputs:{coconut:null,logs:null},outputs:{fireworks:null}},{id:'coconut-corn',name:'Kokosnüsse und Mais',inputs:{coconut:null,corn:null},outputs:{fireworks:null}},{id:'coal-logs',name:'Kohle und Holz',inputs:{coal:null,logs:null},outputs:{fireworks:null}},{id:'coal-corn',name:'Kohle und Mais',inputs:{coal:null,corn:null},outputs:{fireworks:null}}]},
  raw('pearl-divers','Perlentaucher','⚪','pearls',.8,4,'DLC-Rohstoffgewinnung','tropican-shores','estimated',estimated),
  raw('beekeeper','Imkerei','🐝','sugar',1.5,4,'DLC-Rohstoffgewinnung','return-to-nature','estimated',estimated),
  {id:'charcoal-burner',name:'Köhlerei',icon:'🔥',category:'DLC-Industrie',dlc:'return-to-nature',workers:4,education:'uneducated',kind:'production',stage:1,dataStatus:'estimated',source:estimated,modes:[{id:'normal',name:'Normalbetrieb',inputs:{logs:3.2},outputs:{coal:7}}]},
  {id:'paper-mill',name:'Papiermühle',icon:'📄',category:'DLC-Industrie',dlc:'return-to-nature',workers:5,education:'uneducated',kind:'production',stage:1,dataStatus:'estimated',source:estimated,modes:[{id:'logs',name:'Holzstämme',inputs:{logs:4},outputs:{paper:10}},{id:'coconut',name:'Kokosnüsse',inputs:{coconut:3.66},outputs:{paper:10}},{id:'cotton',name:'Baumwolle',inputs:{cotton:4.5},outputs:{paper:10}},{id:'wool',name:'Wolle',inputs:{wool:2.5},outputs:{paper:10}}]},
  {id:'printing-house',name:'Druckerei',icon:'📚',category:'DLC-Industrie',dlc:'return-to-nature',workers:5,education:'uneducated',kind:'production',stage:2,dataStatus:'estimated',source:estimated,modes:[{id:'paper',name:'Papierausgabe',inputs:{paper:10.8},outputs:{books:4}},{id:'leather',name:'Ledereinband',inputs:{paper:6,leather:2},outputs:{books:4}}]},
  {id:'teamster-office',name:'Transportbüro',icon:'🐎',category:'Logistik',dlc:'base',workers:6,education:'uneducated',kind:'teamster',stage:99,dataStatus:'model',source:'Kapazitätsmodell mit 500 Einheiten je Fahrt und angenommener Fahrtenzahl',modes:[{id:'standard',name:'Sichere Ladung',inputs:{},outputs:{}},{id:'loose-load',name:'Lockere Ladegrenzen',inputs:{},outputs:{}}]},

  pending('oil-well','Ölquelle',4,'high-school','world-wars',0,[pendingMode('standard','Standard',[],['oil'])]),
  pending('mine-nickel','Nickelmine',5,'uneducated','world-wars',0,[pendingMode('standard','Standard',[],['nickel'])]),
  pending('cannery','Konservenfabrik',8,'uneducated','world-wars',1,[pendingMode('pineapple','Ananas', ['pineapple'],['canned']),pendingMode('fish','Fisch',['fish'],['canned']),pendingMode('meat','Fleisch',['meat'],['canned']),pendingMode('coffee','Kaffee',['coffee'],['canned'])]),
  pending('creamery','Molkerei',4,'uneducated','world-wars',1,[pendingMode('standard','Standard',['milk'],['cheese'])]),
  pending('cigar-factory','Zigarrenfabrik',5,'high-school','world-wars',1,[pendingMode('standard','Standard',['tobacco'],['cigars'])]),
  pending('shipyard','Schiffswerft',5,'high-school','world-wars',1,[pendingMode('standard','Standard',['planks'],['boats']),pendingMode('aluminium','Aluminiumrümpfe',['planks','aluminium'],['boats'])]),
  pending('steel-mill','Stahlwerk',8,'high-school','world-wars',1,[pendingMode('standard','Standard',['iron','coal'],['steel'])]),
  pending('textile-mill','Textilfabrik',10,'uneducated','world-wars',1,[pendingMode('cotton','Baumwolle',['cotton'],['cloth']),pendingMode('wool','Wolle',['wool'],['cloth'])]),
  pending('weapons-factory','Waffenfabrik',8,'high-school','world-wars',2,[pendingMode('standard','Standard',['steel','nickel'],['weapons'])]),
  pending('balloon-factory','Ballonfabrik',4,'high-school','world-wars',1,[pendingMode('rubber','Gummi',['rubber'],['balloons']),pendingMode('oil','Öl',['oil'],['balloons']),pendingMode('fish','Fisch',['fish'],['balloons'])],'festival'),
  pending('yacht-shipyard','Yachtwerft',6,'high-school','world-wars',2,[pendingMode('standard','Standard',['boats'],['yachts'])],'tropican-shores'),

  pending('fish-farm','Fischfarm',4,'high-school','cold-war',0,[pendingMode('fish','Fisch',[],['fish']),pendingMode('shellfish','Schalentiere',[],['shellfish'])]),
  pending('oil-rig','Ölplattform',6,'high-school','cold-war',0,[pendingMode('standard','Standard',[],['oil'])]),
  pending('mine-aluminium','Aluminiummine',5,'uneducated','cold-war',0,[pendingMode('standard','Standard',[],['aluminium'])]),
  pending('mine-uranium','Uranmine',5,'uneducated','cold-war',0,[pendingMode('standard','Standard',[],['uranium'])]),
  pending('chocolate-factory','Schokoladenfabrik',5,'uneducated','cold-war',1,[pendingMode('standard','Standard',['cocoa'],['chocolate']),pendingMode('sweet','Gesüßt',['cocoa','sugar'],['chocolate'])]),
  pending('furniture-factory','Möbelfabrik',5,'uneducated','cold-war',2,[pendingMode('standard','Standard',['planks'],['furniture']),pendingMode('plastic','Kunststoffmöbel',['plastics'],['furniture'])]),
  pending('jewelry-workshop','Schmuckwerkstatt',4,'high-school','cold-war',1,[pendingMode('gold','Gold',['gold'],['jewelry']),pendingMode('pearls','Perlen',['pearls'],['jewelry'])]),
  pending('plastics-plant','Kunststofffabrik',5,'uneducated','cold-war',1,[pendingMode('oil','Öl',['oil'],['plastics']),pendingMode('corn','Mais',['corn'],['plastics'])]),
  pending('vehicle-factory','Fahrzeugfabrik',10,'high-school','cold-war',2,[pendingMode('standard','Standard',['steel','rubber'],['cars'])]),

  pending('hydroponic-plantation','Hydroponische Plantage',4,'high-school','modern',0,[pendingMode('banana','Bananen',[],['banana']),pendingMode('cocoa','Kakao',[],['cocoa']),pendingMode('coffee','Kaffee',[],['coffee']),pendingMode('corn','Mais',[],['corn']),pendingMode('cotton','Baumwolle',[],['cotton']),pendingMode('pineapple','Ananas',[],['pineapple']),pendingMode('rubber','Kautschuk',[],['rubber']),pendingMode('sugar','Zucker',[],['sugar']),pendingMode('tobacco','Tabak',[],['tobacco'])]),
  pending('factory-ranch','Industrielle Tierfarm',4,'uneducated','modern',0,[pendingMode('cattle','Rinder',['corn'],['meat','hides']),pendingMode('sheep','Schafe',['corn'],['wool','milk']),pendingMode('pig','Schweine',['corn'],['meat']),pendingMode('llama','Lamas',['corn'],['wool']),pendingMode('goat','Ziegen',['corn'],['milk']),pendingMode('crocodile','Krokodile',['fish'],['leather'])]),
  pending('automated-mine','Automatisierte Mine',3,'uneducated','modern',0,[pendingMode('coal','Kohle',[],['coal']),pendingMode('iron','Eisen',[],['iron']),pendingMode('gold','Gold',[],['gold']),pendingMode('nickel','Nickel',[],['nickel']),pendingMode('aluminium','Aluminium',[],['aluminium']),pendingMode('uranium','Uran',[],['uranium'])]),
  pending('electronics-factory','Elektronikfabrik',8,'high-school','modern',2,[pendingMode('standard','Standard',['gold','plastics'],['electronics'])]),
  pending('fashion-company','Modeunternehmen',4,'uneducated','modern',2,[pendingMode('leather','Leder',['leather'],['apparel']),pendingMode('cloth','Stoff',['cloth'],['apparel'])]),
  pending('pharmaceutical-company','Pharmaunternehmen',6,'high-school','modern',1,[pendingMode('oil','Öl',['oil'],['pharmaceuticals']),pendingMode('sugar','Zucker',['sugar'],['pharmaceuticals'])]),
  pending('juicery','Saftfabrik',5,'uneducated','modern',1,[pendingMode('banana','Bananen',['banana'],['juice']),pendingMode('pineapple','Ananas',['pineapple'],['juice']),pendingMode('coconut','Kokosnüsse',['coconut'],['juice'])]),
  pending('smart-furniture-studio','Smart-Möbelstudio',10,'uneducated','modern',2,[pendingMode('standard','Standard',['furniture','electronics'],['smartFurniture'])],'llama')
];

export const DEFAULT_SETTINGS: Settings = {tooltips:true,compact:false,profile:'realistic',worktimeFactor:.8,logisticsFactor:.9,transportTripsPerWorker:2};

export const PROFILES = {
  optimistic:{name:'Optimistisch',worktimeFactor:.95,logisticsFactor:.98,description:'Kurze Wege und zuverlässige Abholung'},
  realistic:{name:'Realistisch',worktimeFactor:.8,logisticsFactor:.9,description:'Normale Wege und gelegentliche Verzögerungen'},
  difficult:{name:'Schlechte Anbindung',worktimeFactor:.65,logisticsFactor:.75,description:'Lange Wege und häufige Transportprobleme'},
  custom:{name:'Benutzerdefiniert',worktimeFactor:1,logisticsFactor:1,description:'Eigene Annahmen verwenden'}
};
