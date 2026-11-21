import {useEffect,useRef,useState} from 'react';
import {API_URL} from '../utils/api';
let library;
const loadGoogle=()=>library||(library=new Promise((resolve,reject)=>{if(window.google?.accounts?.id)return resolve();const script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true;script.onload=resolve;script.onerror=()=>{library=null;reject(new Error('No pudimos cargar Google. Usa correo y contraseña.'));};document.head.appendChild(script);}));
export default function GoogleSignIn({onLogin}){
 const container=useRef(null),[message,setMessage]=useState('Cargando acceso con Google…');
 useEffect(()=>{let active=true;fetch(`${API_URL}/auth/google/config`).then(r=>r.json()).then(async config=>{
  if(!config.clientId){if(active)setMessage('Google estará disponible próximamente. Puedes crear tu cuenta con correo.');return;}
  await loadGoogle();if(!active)return;
  window.google.accounts.id.initialize({client_id:config.clientId,callback:async({credential})=>{
   try{const res=await fetch(`${API_URL}/auth/google`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({credential})});const data=await res.json();if(!res.ok||!data.success)throw new Error(data.message);if(active)onLogin(data);}
   catch(e){if(active)setMessage(e.message||'No pudimos iniciar sesión.');}
  }});window.google.accounts.id.renderButton(container.current,{theme:'outline',size:'large',text:'continue_with',locale:'es'});setMessage('');
 }).catch(e=>{if(active)setMessage(e.message||'Acceso con Google no disponible.');});return()=>{active=false;};},[onLogin]);
 return <div><div ref={container}/>{message&&<p className="muted-note" role="status">{message}</p>}</div>;
}
