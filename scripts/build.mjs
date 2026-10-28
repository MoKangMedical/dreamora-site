import {createHash} from 'node:crypto';
import {cp,mkdir,rm,readFile,writeFile,stat} from 'node:fs/promises';
import {content} from '../site/content.mjs';
import {render} from '../site/render.mjs';
const root=new URL('../',import.meta.url);
const version=createHash('sha256').update((await Promise.all(['app.js','render.mjs','content.mjs','interactive.mjs','references.mjs','principle.mjs','products.mjs','dream-theory.mjs','style.css'].map(name=>readFile(new URL('site/'+name,root),'utf8')))).join('')).digest('hex').slice(0,12);
const template=await readFile(new URL('site/index.html',root),'utf8');
await rm(new URL('dist',root),{recursive:true,force:true});
await mkdir(new URL('dist',root),{recursive:true});
await cp(new URL('site',root),new URL('dist',root),{recursive:true});
for(const key of ['ultrasound','feedback']){
 await stat(new URL(`site/assets/${key}-concept.mp4`,root));
 await stat(new URL(`site/assets/${key}-poster.webp`,root));
}
for(const lang of ['zh','en']){
 const c=content[lang],body=render(c,lang);
 for(const id of ['experiences','platform','research','mechanism','faq'])if(!body.includes(`id="${id}"`))throw Error(`Missing ${id}`);
 for(const asset of ['hero','learning','meeting','universe'])await stat(new URL(`site/assets/${asset}.webp`,root));
 const html=template.replace('href="./style.css"',`href="./style.css?v=${version}"`).replace('src="./app.js"',`src="./app.js?v=${version}"`).replace('<!--APP-->',body).replace('<html lang="zh-CN">',`<html lang="${c.lang}">`).replace('<title>梦境星球 Dreamora</title>',`<title>${c.title}</title>`);
 if(lang==='zh')await writeFile(new URL('dist/index.html',root),html);
}
console.log('Built bilingual static site → dist (Chinese prerender + complete English switch).');

for(const name of ['app.js','render.mjs','interactive.mjs','references.mjs','principle.mjs','products.mjs','dream-theory.mjs']){const url=new URL('dist/'+name,root);const js=await readFile(url,'utf8');await writeFile(url,js.replace(/from '(\.\/[^']+\.(?:mjs|js))'/g,(_,p)=>`from '${p}?v=${version}'`));}
