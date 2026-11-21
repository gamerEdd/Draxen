import {rateLimit} from 'express-rate-limit';
export const authLimit=rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:'draft-7',legacyHeaders:false,message:{success:false,message:'Demasiados intentos. Espera 15 minutos.'}});
export const orderLimit=rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:'draft-7',legacyHeaders:false,message:{success:false,message:'Has enviado varios pedidos. Espera unos minutos.'}});
