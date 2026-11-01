import fs from 'node:fs/promises';
import path from 'node:path';
import {api,all,root,env,locale,ref,slug,asset,saveEntry,updateModel,field} from './lib/contentful-management.mjs';
import {reviewAlumniIndustries} from '../src/lib/alumniReview.ts';
const apply=process.argv.includes('--apply');
const defaults=JSON.parse(await fs.readFile('src/data/launchDefaults.json','utf8'));
const projects=JSON.parse(await fs.readFile('src/data/portfolioReview.json','utf8'));
const [types,entries,assets,hooks]=await Promise.all([all('content_types'),all('entries'),all('assets'),api(`${root}/webhook_definitions`)]);
const backup='.review-backups/production-before-2026-11-01/management-content.json';
try{await fs.writeFile(backup,JSON.stringify({savedAt:new Date().toISOString(),types,entries,assets},null,2),{flag:'wx',mode:0o600});}catch(e){if(e.code!=='EEXIST')throw e;}
for(const hook of hooks.items){if(hook.scopes?.some(s=>/Entry\.(publish|save)|\*\.\*/i.test(s))&&!JSON.stringify(hook.filters||[]).includes('siteRebuildTrigger'))throw Error('Review the unexpected broad publish webhook before continuing.');}
console.log(`Backed up ${entries.length} entries and ${assets.length} assets. ${apply?'Applying':'Planning'} November content migration.`);
if(!apply){console.log('Plan: 37 complete project entries, eight featured links, 46 alumni destinations in five ordered groups, editable semester / portfolio membership / section copy / logo surfaces. No entries deleted, no rebuild triggered.');process.exit();}
if(entries.find(e=>e.sys.contentType.sys.id==='clientsPage')?.fields.portfolioReleaseVersion?.[locale]==='2026-11-01' && !process.argv.includes('--force')) {console.log('November content is already migrated. Editor changes are preserved.');process.exit();}
await updateModel('clients',[field('semester'),{...types.find(t=>t.sys.id==='clients').fields.find(f=>f.id==='summary'),name:'Short Description (hover preview)'},{...types.find(t=>t.sys.id==='clients').fields.find(f=>f.id==='description'),name:'Long Description (project details)'}]);
await updateModel('clientsPage',[field('portfolioReleaseVersion'),field('portfolio','Array',{items:{type:'Link',linkType:'Entry',validations:[{linkContentType:['clients']}]}}),field('portfolioDescription','Text'),field('historyTitle'),field('historyDescription','Text'),field('portfolioLinkLabel')]);
const groups=reviewAlumniIndustries(defaults.alumniIndustries);
await updateModel('alumniIndustry',[field('layout','Symbol',{validations:[{in:['consulting','finance','tech','more',...groups.map(g=>g.layout)]}]})]);
await updateModel('alumniDestination',[field('surface','Symbol',{validations:[{in:['white','navy','red','green','maroon','black','doordash','adl-blue']}]}),field('backgroundColor','Symbol',{name:'Card Background Color (hex, optional)'}),field('logoFit','Symbol',{validations:[{in:['contain','cover']}]}),field('logoPadding','Integer',{name:'Logo Padding (pixels)',validations:[{range:{min:0,max:80}}]})]);
const normalize=s=>s.toLowerCase().replace(/[^a-z]/g,'');
const oldClients=entries.filter(e=>e.sys.contentType.sys.id==='clients');
const assetById=new Map(assets.map(a=>[a.sys.id,a]));
async function logoAsset(file,name,current){
 if(file?.startsWith('/assets/')){
  if(current&&assetById.get(current.sys.id)?.fields.file?.[locale]?.fileName===path.basename(file))return current;
  return asset(`ccg-nov-logo-${slug(path.basename(file))}`,file,name);
 }
 return current || null;
}
let portfolio=[],featured=[];
for(const project of projects){
 const old=oldClients.find(e=>normalize(e.fields.companyName?.[locale]||'')===normalize(project.companyName));
 const id=old?.sys.id||`ccg-project-${slug(project.companyName)}`;
 let logo=project.companyName==='Education Co.'?null:await logoAsset(project.logo,project.companyName,old?.fields.logo?.[locale]);
 const link=await saveEntry(id,'clients',{companyName:project.companyName,semester:project.semester,description:project.description||'',summary:project.summary,logo});
 portfolio.push(link);if(project.featured)featured.push(link);
}
console.log(`Prepared ${portfolio.length} projects and ${featured.length} featured engagements.`);
const colors={'Goldman Sachs':'#6698c9','Centerview Partners':'#0056ad','Lazard':'#23283c','Blackstone':'#000000','a16z':'#4b1724'};
let industries=[];
for(const group of groups){const destinations=[];for(const d of group.employers){
 const old=entries.find(e=>e.sys.contentType.sys.id==='alumniDestination'&&e.fields.name?.[locale]===d.name);
 const id=old?.sys.id||`ccg-alumni-${slug(d.name)}`;
 const logo=await logoAsset(d.logo,d.name,old?.fields.logo?.[locale]);
 const custom=['Goldman Sachs','Centerview Partners','Lazard','Blackstone'].includes(d.name);
 destinations.push(await saveEntry(id,'alumniDestination',{name:d.name,logo,surface:d.surface,invertLogo:!!d.invertLogo,largeLogo:!!d.largeLogo,showCaption:!!d.showCaption,backgroundColor:colors[d.name]||null,logoFit:d.name==='Lazard'?'cover':'contain',logoPadding:custom?(d.name==='Goldman Sachs'?18:0):null}));
 }industries.push(await saveEntry(`ccg-industry-${group.layout}`,'alumniIndustry',{title:group.name,layout:group.layout,destinations}));console.log(`Prepared ${group.name}: ${destinations.length} destinations.`);}
const page=entries.find(e=>e.sys.contentType.sys.id==='clientsPage');
await saveEntry(page.sys.id,'clientsPage',{portfolio,portfolioReleaseVersion:'2026-11-01',portfolioTitle:'Selected Engagements',portfolioDescription:'A closer look at the research, strategies, and recommendations behind our client work. Select a project to explore the engagement.',historyTitle:'Our Client Portfolio',historyDescription:'Explore engagements across industries and semesters, from our latest work to earlier projects.',portfolioLinkLabel:'Explore the Full Portfolio'});
const home=entries.find(e=>e.sys.contentType.sys.id==='homepage');
await saveEntry(home.sys.id,'homepage',{featuredClients:featured,alumniIndustries:industries});
console.log('Migration complete. Published content is editable; Site Rebuild Trigger was not changed.');
