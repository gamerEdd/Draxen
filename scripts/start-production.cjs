const path = require('node:path');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
if (!fs.existsSync(path.join(root, 'frontend/dist/index.html'))) {
  console.error('Primero ejecuta npm run build (o usa npm run prod).');
  process.exit(1);
}
const child = spawn(process.execPath, ['src/server.js'], {
  cwd: path.join(root, 'backend'),
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production', HOST: process.env.HOST || '0.0.0.0', PORT: process.env.PORT || '8080' }
});
child.on('error', error => { console.error(error.message); process.exit(1); });
child.on('exit', code => process.exit(code ?? 1));
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
