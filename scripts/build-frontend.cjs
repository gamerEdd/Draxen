const fs = require('node:fs/promises');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {randomUUID}=require('node:crypto');
const frontend = path.resolve(__dirname, '../frontend');
const buildId=randomUUID();
const staging = path.join(frontend, `.dist-staging-${buildId}`);
const live = path.join(frontend, 'dist');
async function build() {
  const result = spawnSync(process.execPath, [path.join(frontend, 'node_modules/vite/bin/vite.js'), 'build', '--outDir', staging, '--emptyOutDir', ...process.argv.slice(2)], {cwd:frontend, stdio:'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
  await fs.mkdir(live, {recursive:true});
  // Publish images and bundles first. Preserve previous assets for open tabs.
  for (const entry of await fs.readdir(staging)) {
    if (entry === 'index.html') continue;
    await fs.cp(path.join(staging,entry), path.join(live,entry), {recursive:true});
  }
  const next = path.join(live, `.index-next-${buildId}.html`);
  await fs.copyFile(path.join(staging, 'index.html'), next);
  await fs.rename(next, path.join(live, 'index.html'));
  console.log('Publicado sin vaciar el sitio activo.');
  // Delete only this build's verified workspace directory.
  if(path.dirname(staging)===frontend&&path.basename(staging)===`.dist-staging-${buildId}`)await fs.rm(staging,{recursive:true,force:true});
}
build().catch(error=>{console.error(error);process.exitCode=1;});
