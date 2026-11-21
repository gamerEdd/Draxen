import {OAuth2Client} from 'google-auth-library';
import {randomBytes} from 'node:crypto';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import {generateToken} from '../config/jwt.js';
import {asyncHandler} from '../utils/errors.js';
import {orderError} from '../services/orderValidation.js';
const client=new OAuth2Client();
export const googleConfig=(req,res)=>res.json({success:true,clientId:process.env.GOOGLE_CLIENT_ID||null});
export const googleLogin=asyncHandler(async(req,res)=>{
 if(!process.env.GOOGLE_CLIENT_ID)throw orderError('Google todavía no está configurado. Usa correo y contraseña.',503);
 if(typeof req.body.credential!=='string'||req.body.credential.length>10000)throw orderError('Credencial inválida.');
 let payload;
 try{payload=(await client.verifyIdToken({idToken:req.body.credential,audience:process.env.GOOGLE_CLIENT_ID})).getPayload();}
 catch{throw orderError('No pudimos verificar tu cuenta Google.',401);}
 if(!payload?.sub||!payload.email_verified||!payload.email||payload.email.length>100)throw orderError('Necesitamos un correo Google verificado.',401);
 const connection=await pool.getConnection();
 let user;
 try{
  await connection.beginTransaction();
  const [linked]=await connection.query('SELECT u.* FROM usuario_google g JOIN usuarios u ON u.id=g.usuario_id WHERE g.google_sub=?',[payload.sub]);
  user=linked[0];
  if(!user){
   const [existing]=await connection.query('SELECT id FROM usuarios WHERE email=?',[payload.email.toLowerCase()]);
   // Never link an existing password account merely because the emails match.
   if(existing.length)throw orderError('Ya existe una cuenta con este correo. Entra con tu contraseña.',409);
   const hash=await bcrypt.hash(randomBytes(32).toString('hex'),10);
   const [created]=await connection.query("INSERT INTO usuarios (nombre,email,password_hash,rol) VALUES (?,?,?,'CLIENTE')",[(payload.name||payload.email).slice(0,100),payload.email.toLowerCase(),hash]);
   await connection.query('INSERT INTO usuario_google (google_sub,usuario_id) VALUES (?,?)',[payload.sub,created.insertId]);
   user={id:created.insertId,nombre:(payload.name||payload.email).slice(0,100),email:payload.email.toLowerCase(),rol:'CLIENTE',activo:1};
  }
  if(!user.activo)throw orderError('Cuenta desactivada.',403);
  await connection.commit();
 }catch(error){await connection.rollback();if(error.code==='ER_DUP_ENTRY')throw orderError('La cuenta ya existe. Intenta iniciar sesión de nuevo.',409);throw error;}finally{connection.release();}
 res.json({success:true,token:generateToken(user.id,user.rol),usuario:{id:user.id,nombre:user.nombre,email:user.email,rol:user.rol}});
});
