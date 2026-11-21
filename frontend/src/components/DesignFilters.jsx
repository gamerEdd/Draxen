import {designCategories,designs,getDesignSubcategories} from '../data/catalog';
export default function DesignFilters({category,subcategory,onChange,id='design-filters'}){
 const options=getDesignSubcategories(designs,category);
 return <div className="design-taxonomy"><div className="category-tabs" role="group" aria-label="Categorías de estampados">{['',...designCategories].map(c=><button type="button" key={c} className={category===c?'active':''} aria-pressed={category===c} onClick={()=>onChange(c,'')}>{c||'Todas las categorías'}</button>)}</div><label className="subcategory-filter" htmlFor={id}>{category==='Rock'?'Banda o temática':category==='Anime'?'Serie o universo':'Subcategoría'}<select id={id} value={subcategory} onChange={e=>onChange(category,e.target.value)}><option value="">{category?'Todas las subcategorías':'Todas las series, bandas y temas'}</option>{options.map(s=><option key={s} value={s}>{s}</option>)}</select></label></div>;
}
