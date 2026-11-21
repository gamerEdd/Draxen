export const DESIGN_CATEGORIES=['Anime','Rock','Memes','Series animadas','Videojuegos','Ilustraciones'];
const normalize=value=>(value||'').normalize('NFKD').replace(/\p{Diacritic}/gu,'').replace(/[×]/g,'x').trim().toLowerCase();
export function isPublishedDesign(design){
 return !['pending','excluded'].includes(design.classificationStatus)&&![design.name,design.collection,design.subcategory].some(value=>normalize(value).includes('por verificar'));
}
const aliases={'Hunter × Hunter':'Hunter x Hunter','Spy × Family':'Spy x Family','Guns N Roses':"Guns N’ Roses"};
const bands=['Iron Maiden','Avenged Sevenfold','Sodom','Barón Rojo','Los Suaves','2 Minutos','Rammstein','Slipknot','Nokturnal Mortum','Death','Lacrimosa','Gorillaz','Megadeth','Slayer','Metallica','Misfits','Linkin Park','Nirvana','Black Sabbath','Marilyn Manson','Ozzy Osbourne','Héroes del Silencio','Hermética','Helloween','Soda Stereo','Sepultura','Kiss','Stratovarius','Saratoga','Mägo de Oz','System of a Down','Queen','AC/DC','Def Leppard','Led Zeppelin','Motörhead','Foo Fighters','Judas Priest','Bathory','Marduk','Dissection','Mayhem','Behemoth','Cradle of Filth','Unleashed','Krisiun','Dimmu Borgir','Rotting Christ','Sarcófago','Nocturnal Depression','Kreator','Amon Amarth','Vital Remains','Obituary','Brujería','Venom','Deftones','Cannabis Corpse','Alice in Chains','Anthrax','Pantera',"Guns N’ Roses",'Parálisis Permanente','Whitesnake','Oasis','The Beatles','Red Hot Chili Peppers','Children of Bodom','Bullet for My Valentine','Pink Floyd','As I Lay Dying','Danzig','Bunbury','Rolling Stones','Green Day','The Cure','Evanescence'];
export function classifyDesign(design){
 const collection=aliases[design.collection]||design.collection;
 let group=design.group||(['Rock','Memes'].includes(collection)?collection:'Anime'),subcategory=design.subcategory;
 if(group==='Rock'){
  const prefix=(design.name||'').split(' · ')[0];
  subcategory=subcategory||bands.find(b=>normalize(b)===normalize(collection)||normalize(b)===normalize(prefix));
  subcategory=subcategory||(/calavera|craneo|skull/i.test(design.name)?'Calaveras':['Baphomet','La Parca'].includes(collection)?'Arte oscuro':'Arte rock');
 }else if(group==='Memes'){
  subcategory=subcategory||(design.id==='doom-ramon'?'Parodias':/alien/i.test(design.id)?'Aliens':/battery|toast/i.test(design.id)?'Humor cotidiano':'Animales');
 }else if(['Rick y Morty','Futurama'].includes(group)||['Rick y Morty','Futurama'].includes(collection)){
  group='Series animadas';subcategory=collection;
 }else if(group==='Videojuegos')subcategory=subcategory||collection;
 else if(['Fantasía','Cómics','Ilustraciones'].includes(group)){group='Ilustraciones';subcategory=subcategory||'Fantasía oscura';}
 else if(group==='Anime'||!group){group='Anime';subcategory=subcategory||collection;}
 else{subcategory=subcategory||collection;}
 return {...design,group,subcategory,collection:subcategory};
}
export function matchesDesignCategory(design,category='',subcategory=''){
 if(!design)return false;
 const d=design.subcategory?design:classifyDesign(design);
 return (!category||[d.group,d.subcategory].some(v=>normalize(v)===normalize(category)))&&(!subcategory||normalize(d.subcategory)===normalize(subcategory));
}
export function getDesignSubcategories(designs,category=''){
 return [...new Set(designs.filter(d=>isPublishedDesign(d)&&(!category||normalize(d.group)===normalize(category))).map(d=>d.subcategory).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
}
export function getCategorySelection(designs,category='',subcategory=''){
 const main=DESIGN_CATEGORIES.find(c=>normalize(c)===normalize(category));
 if(main)return {category:main,subcategory};
 const design=designs.find(d=>normalize(d.subcategory)===normalize(category));
 return design?{category:design.group,subcategory:design.subcategory}:{category:'',subcategory};
}
export function matchesDesignSearch(design,query=''){
 return normalize(`${design.name} ${design.group} ${design.subcategory}`).includes(normalize(query));
}
