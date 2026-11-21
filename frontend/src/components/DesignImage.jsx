import {useState} from 'react';

// Kept outside the PNG-to-WebP build transform so recovery really loads a PNG.
export default function DesignImage({src, thumbnail=false, alt='', ...props}) {
  const [attempt,setAttempt]=useState(0);
  const [retry,setRetry]=useState(0);
  const original=src.replace(/\.webp(?=\?|$)/, '.png');
  const small=src.replace(/\.webp(?=\?|$)/, '.thumb.webp');
  const candidate=attempt===0 ? (thumbnail?small:src) : attempt===1 ? src : original;
  const url=retry ? `${candidate}${candidate.includes('?')?'&':'?'}retry=${retry}` : candidate;
  if(attempt>2) return <span className="design-image-error" role="status">No se pudo cargar {alt||'el estampado'}.{!thumbnail&&<> <button type="button" onClick={()=>{setAttempt(0);setRetry(Date.now());}}>Reintentar</button></>}</span>;
  return <img {...props} src={url} alt={alt} onError={()=>setAttempt(n=>n+1)} decoding="async"/>;
}
