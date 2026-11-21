import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {DESIGNS} from './designs.mjs';
import {DESIGN_CATEGORIES,matchesDesignCategory,getDesignSubcategories,getCategorySelection,matchesDesignSearch,isPublishedDesign} from './designCategories.mjs';
const byId=id=>DESIGNS.find(d=>d.id===id);
test('every design has an explicit parent and a subcategory; all IDs remain unique',()=>{
 assert.equal(new Set(DESIGNS.map(d=>d.id)).size,DESIGNS.length);
 for(const d of DESIGNS){assert.ok(DESIGN_CATEGORIES.includes(d.group),d.id);assert.ok(d.subcategory,d.id);}
});
test('audited anime cannot leak into the previous wrong series',()=>{
 for(const [id,correct,wrong]of [['ref-221-front','Solo Leveling','One Piece'],['ref-208-front','One Punch Man','One Piece'],['ref-232-front','Jujutsu Kaisen','One Piece'],['ref-236-front','Demon Slayer','One Piece'],['ref-240-front','Demon Slayer','My Hero Academia'],['ref-154-front','Death Note','Saint Seiya']]){
  assert.equal(matchesDesignCategory(byId(id),'Anime',correct),true,id);
  assert.equal(matchesDesignCategory(byId(id),'Anime',wrong),false,id);
 }
});
test('bands are separate from general rock artwork and exact matching prevents false positives',()=>{
 assert.equal(matchesDesignCategory(byId('ref-116-front'),'Rock','Rolling Stones'),true);
 assert.equal(matchesDesignCategory(byId('ref-116-front'),'Rock','Whitesnake'),false);
 assert.equal(matchesDesignCategory(byId('ref-119-front'),'Rock','Avenged Sevenfold'),true);
 assert.equal(matchesDesignCategory(byId('drop100-megadeth-rust'),'Rock','Megadeth'),true);
 assert.equal(matchesDesignCategory(byId('drop100-skull-guitar'),'Rock','Megadeth'),false);
 assert.equal(matchesDesignCategory(byId('ref-013-front'),'Rock','Death Note'),false);
 assert.equal(byId('rock').group,'Rock');
 assert.equal(byId('metal').group,'Rock');
 assert.equal(byId('meme').group,'Memes');
});
test('aliases, legacy series URLs, memes and animated series share the hierarchy',()=>{
 assert.equal(byId('hunter').subcategory,'Hunter x Hunter');
 assert.deepEqual(getCategorySelection(DESIGNS,'Hunter × Hunter'),{category:'Anime',subcategory:'Hunter x Hunter'});
 assert.deepEqual(getCategorySelection(DESIGNS,'Futurama'),{category:'Series animadas',subcategory:'Futurama'});
 assert.ok(getDesignSubcategories(DESIGNS,'Memes').includes('Animales'));
 assert.equal(matchesDesignCategory(byId('futurama-bender'),'Anime'),false);
 assert.equal(matchesDesignSearch(byId('ref-116-front'),'rolling stones'),true);
});
test('mixed and uncertain illustrations do not claim a verified series',()=>{
 assert.equal(byId('ref-155-front').subcategory,'Crossovers');
 assert.equal(byId('ref-155-front').classificationStatus,'mixed');
 assert.equal(byId('ref-222-front'),undefined);
 assert.equal(getDesignSubcategories(DESIGNS).includes('Por verificar'),false);
 assert.equal(isPublishedDesign({name:'Arte',classificationStatus:'pending'}),false);
 assert.equal(isPublishedDesign({name:'Identidad por verificar'}),false);
 assert.equal(isPublishedDesign({collection:'Por verificar'}),false);
});
test('classification audit covers every file and preserves original image bytes',async()=>{
 const review=JSON.parse(await fs.readFile(new URL('../docs/catalog-audit/review.json',import.meta.url),'utf8'));
 assert.equal(review.count,DESIGNS.length);
 for(const d of DESIGNS){const entry=review.designs.find(r=>r.id===d.id);assert.ok(entry,d.id);assert.equal(entry.category,d.group);assert.equal(entry.subcategory,d.subcategory);const bytes=await fs.readFile(new URL('../frontend/public'+d.src,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256,d.id);}
});
