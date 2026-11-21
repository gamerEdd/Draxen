import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import dotenv from 'dotenv';
dotenv.config({path:fileURLToPath(new URL('../.env',import.meta.url))});
const {default:pool}=await import('../src/config/database.js');
try {
 const sql=await readFile(new URL('../../database/migrations/001_custom_orders.sql',import.meta.url),'utf8');
 for(const statement of sql.split(';').map(s=>s.trim()).filter(Boolean)) await pool.query(statement);
 console.log('Migración de cuentas Google, diseños e historial aplicada.');
} finally {await pool.end();}
