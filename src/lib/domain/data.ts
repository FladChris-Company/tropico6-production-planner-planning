import type { Building, Era, Settings } from './types';
import { WORKFORCE_BUILDINGS } from './workforce-data';
import colonialData from './generated/colonial-data.json';

export const ERAS: { id: Era; name: string; loadPerTrip: number }[] = [
  {id:'colonial',name:'Kolonialzeit',loadPerTrip:500},
  {id:'world-wars',name:'Weltkriege',loadPerTrip:800},
  {id:'cold-war',name:'Kalter Krieg',loadPerTrip:800},
  {id:'modern',name:'Moderne',loadPerTrip:1200}
];

const ERA_ORDER: Era[] = ERAS.map(era=>era.id);
export const buildingAvailableInEra = (building: Building, era: Era) => ERA_ORDER.indexOf(building.availableFrom??'colonial')<=ERA_ORDER.indexOf(era);
export const missingCalculationLabel = 'Keine belastbare Berechnung';
export const describeDataStatus = (status: Building['dataStatus']) => ({
  verified:'Datengrundlage: bestätigter statischer Spielwert.',
  measured:'Datengrundlage: normierter Community-Messwert.',
  estimated:'Datengrundlage: gekennzeichneter Schätzwert.',
  unknown:'Es wurden bisher keine klar belastbaren Produktionswerte gefunden. Daher gibt es hier keine korrekte Berechnung.',
  model:'Datengrundlage: transparente Modellannahme.'
})[status];

const LEGACY_GOODS: Record<string, { name: string; icon: string }> = {
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

export const GOODS: Record<string, { name: string; icon: string }> = {
  ...LEGACY_GOODS,
  ...Object.fromEntries(colonialData.goods.map((good) => [good.id, {name:good.name,icon:LEGACY_GOODS[good.id]?.icon??'•'}]))
};

export const DLCS = [
  {id:'base',name:'Grundspiel',description:'Alle regulären Produktionsgebäude der Kolonialzeit'},
  {id:'llama',name:'The Llama of Wall Street',description:'Spielzeugwerkstatt'},
  {id:'festival',name:'Festival',description:'Feuerwerksfabrik'},
  {id:'spitter',name:'Spitter',description:'Zusätzliche Dienstleistungsgebäude'},
  {id:'lobbyistico',name:'Lobbyistico',description:'Zusätzliche Regierungsgebäude'},
  {id:'caribbean-skies',name:'Caribbean Skies',description:'Drohnen und zusätzliche Infrastruktur'},
  {id:'new-frontiers',name:'New Frontiers',description:'Raumfahrt und Zukunftsgebäude'},
  {id:'going-viral',name:'Going Viral',description:'Zusätzliche Gesundheitsgebäude'},
  {id:'tropican-shores',name:'Tropican Shores',description:'Perlentaucher'},
  {id:'return-to-nature',name:'Return to Nature',description:'Imkerei, Köhlerei, Papiermühle und Druckerei'}
];

const pending = (id:string,name:string,workers:number,education:Building['education'],availableFrom:NonNullable<Building['availableFrom']>,stage:number,modes:Building['modes'],dlc='base'):Building => ({
  id,name,icon:'•',category:stage===0?'Rohstoffgewinnung':'Industrie',dlc,workers,education,kind:'production',stage,availableFrom,dataStatus:'unknown',source:'Tropico Wiki: Gebäude, Zeitalter und Arbeitsplätze bestätigt; Produktionsraten noch offen',modes
});
const pendingMode = (id:string,name:string,inputs:string[],outputs:string[]):Building['modes'][number] => ({id,name,inputs:Object.fromEntries(inputs.map(good=>[good,null])),outputs:Object.fromEntries(outputs.map(good=>[good,null]))});
const LATER_BUILDINGS: Building[] = [
  ...WORKFORCE_BUILDINGS.filter((building) => (building.availableFrom ?? 'colonial') !== 'colonial'),

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

const COLONIAL_BUILDINGS = (colonialData.buildings as unknown as Building[]).map((building) => building.id === 'teamster-office' ? {
  ...building,
  modes:[{id:'standard',name:'Sichere Ladung',inputs:{},outputs:{}},{id:'loose-load',name:'Lockere Ladegrenzen',inputs:{},outputs:{}}]
} : building);
export const BUILDINGS: Building[] = [
  ...COLONIAL_BUILDINGS,
  ...LATER_BUILDINGS
];

export const DEFAULT_SETTINGS: Settings = {tooltips:true,compact:false,profile:'realistic',worktimeFactor:.8,logisticsFactor:.9,transportTripsPerWorker:2};

export const PROFILES = {
  optimistic:{name:'Optimistisch',worktimeFactor:.95,logisticsFactor:.98,description:'Kurze Wege und zuverlässige Abholung'},
  realistic:{name:'Realistisch',worktimeFactor:.8,logisticsFactor:.9,description:'Normale Wege und gelegentliche Verzögerungen'},
  difficult:{name:'Schlechte Anbindung',worktimeFactor:.65,logisticsFactor:.75,description:'Lange Wege und häufige Transportprobleme'},
  custom:{name:'Benutzerdefiniert',worktimeFactor:1,logisticsFactor:1,description:'Eigene Annahmen verwenden'}
};
