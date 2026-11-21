// One catalogue card per artwork. Keep every garment variant available in the editor.
export function groupProductsByDesign(products,designs){
 const names=new Map(designs.map(d=>[d.id,d.name])),groups=new Map();
 for(const product of products){
  const existing=groups.get(product.designId);
  if(!existing){groups.set(product.designId,{...product,displayName:names.get(product.designId)||product.nombre,variantTypes:[product.type],variantGenders:[product.gender]});continue;}
  const variantTypes=[...new Set([...existing.variantTypes,product.type])];
  const variantGenders=[...new Set([...existing.variantGenders,product.gender])];
  const representative=product.precio<existing.precio?product:existing;
  groups.set(product.designId,{...representative,displayName:existing.displayName,variantTypes,variantGenders});
 }
 return [...groups.values()];
}
