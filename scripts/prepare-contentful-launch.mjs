import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({quiet:true});
dotenv.config({path:'.env.contentful-management.local',quiet:true});
const defaults=JSON.parse(await fs.readFile('src/data/launchDefaults.json','utf8'));
const token=process.env.CONTENTFUL_MANAGEMENT_TOKEN;
if(!token) throw Error('Save the Contentful management token in .env.contentful-management.local first.');
const space=process.env.PUBLIC_CONTENTFUL_SPACE_ID;
const root=`https://api.contentful.com/spaces/${space}`;
const env=`${root}/environments/master`;
const apply=process.argv.includes('--apply');
async function api(url,method='GET',body,version,extra={}) {
 const response=await fetch(url,{method,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/vnd.contentful.management.v1+json',...(version?{'X-Contentful-Version':String(version)}:{}),...extra},body:body===undefined?undefined:JSON.stringify(body)});
 if(response.status===404)return null;
 if(!response.ok)throw Error(`Contentful ${method} ${url.split('/').slice(-2).join('/')} failed (${response.status}): ${(await response.text()).slice(0,1000)}`);
 return response.status===204?{}:response.json();
}
async function all(kind){let items=[],skip=0;while(true){const r=await api(`${env}/${kind}?limit=100&skip=${skip}`);items.push(...r.items);skip+=r.items.length;if(skip>=r.total) return items;}}
const [types,entries,assets,locales,hooks]=await Promise.all([all('content_types'),all('entries'),all('assets'),api(`${env}/locales`),api(`${root}/webhook_definitions`)]);
const locale=locales.items.find(l=>l.default).code;
const backup='.review-backups/production-before-2026-10-31/management-content.json';
try{await fs.writeFile(backup,JSON.stringify({savedAt:new Date().toISOString(),types,entries,assets,locales},null,2),{flag:'wx',mode:0o600});}catch(e){if(e.code!=='EEXIST')throw e;}
console.log(`Backed up ${entries.length} entries and ${assets.length} assets. ${apply?'Applying':'Planning'} CMS preparation.`);
// Refuse an unexpected publish webhook that could update the live site mid-migration.
for(const hook of hooks.items){if(hook.scopes?.some(s=>/Entry\.(publish|save)|\*\.\*/i.test(s))&&!JSON.stringify(hook.filters||[]).includes('siteRebuildTrigger'))throw Error('A publish webhook is not limited to Site Rebuild Trigger. Review it before migrating.');}
const field=(id,type='Symbol',other={})=>({id,name:id.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase()),type,localized:false,required:false,validations:[],...other});
const link=(id,target,array=false)=>field(id,array?'Array':'Link',array?{items:{type:'Link',linkType:'Entry',validations:[{linkContentType:[target]}]}}:{linkType:'Entry',validations:[{linkContentType:[target]}]});
const models=[
 ['alumniDestination','Alumni destination','name',[field('name'),field('logo','Link',{linkType:'Asset'}),field('surface','Symbol',{validations:[{in:['white','navy','red']}]}),field('invertLogo','Boolean'),field('largeLogo','Boolean'),field('showCaption','Boolean')]],
 ['alumniIndustry','Alumni industry','title',[field('title'),field('layout','Symbol',{validations:[{in:['consulting','finance','tech','more']}]}),link('destinations','alumniDestination',true)]],
 ['processStep','Process step','title',[field('title'),field('description','Text')]],
 ['clientsPage','Clients page','heroTitle',[...Object.keys(defaults.clientsPage).filter(k=>k!=='valuesImage').map(k=>field(k,k==='heroDescription'?'Text':'Symbol')),field('valuesImage','Link',{linkType:'Asset'}),link('processSteps','processStep',true),link('featuredWork','clients',true)]],
];
const homeFields=[field('designReleaseVersion'),...['whoWeAreTitle','teamTitle','alumniTitle','featuredTitle','featuredLinkLabel'].map(k=>field(k)),field('alumniDescription','Text'),field('featuredDescription','Text'),link('featuredClients','clients',true),link('alumniIndustries','alumniIndustry',true),link('clientsPage','clientsPage')];
if(!apply){console.log('Plan: four additional content models; editable homepage, featured clients, alumni industries and process. Existing member, recruitment, report, client, services and values entries stay intact. Run with --apply after reviewing.');process.exit();}
async function model(id,name,displayField,fields){let old=await api(`${env}/content_types/${id}`);const merged=old?[...old.fields,...fields.filter(f=>!old.fields.some(o=>o.id===f.id))]:fields;let result=await api(`${env}/content_types/${id}`,'PUT',{name:old?.name||name,displayField:old?.displayField||displayField,fields:merged},old?.sys.version);await api(`${env}/content_types/${id}/published`,'PUT',undefined,result.sys.version);}
for(const args of models)await model(...args);
const homeType=types.find(t=>t.sys.id==='homepage');await model('homepage',homeType.name,homeType.displayField,[...homeType.fields,...homeFields]);
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48);
const ref=(id,linkType='Entry')=>({sys:{type:'Link',linkType,id}});
const localized=fields=>Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,{[locale]:v}]));
async function entry(id,type,fields){let old=await api(`${env}/entries/${id}`);if(old?.sys.publishedVersion)return ref(id);let r=await api(`${env}/entries/${id}`,'PUT',{fields:localized(fields)},old?.sys.version,{'X-Contentful-Content-Type':type});await api(`${env}/entries/${id}/published`,'PUT',undefined,r.sys.version);return ref(id);}
async function asset(id,file,title){let old=await api(`${env}/assets/${id}`);if(old?.sys.publishedVersion)return ref(id,'Asset');const bytes=await fs.readFile(path.join('public',file));const upload=await fetch(`https://upload.contentful.com/spaces/${space}/uploads`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/octet-stream'},body:bytes});if(!upload.ok)throw Error(`Upload failed (${upload.status})`);const u=await upload.json();const ext=path.extname(file).toLowerCase();let r=await api(`${env}/assets/${id}`,'PUT',{fields:localized({title,file:{fileName:path.basename(file),contentType:ext==='.svg'?'image/svg+xml':ext==='.png'?'image/png':'image/jpeg',uploadFrom:ref(u.sys.id,'Upload')}})},old?.sys.version);await api(`${env}/assets/${id}/files/${locale}/process`,'PUT',undefined,r.sys.version);for(let i=0;i<30;i++){r=await api(`${env}/assets/${id}`);if(r.fields.file[locale].url)break;await new Promise(resolve=>setTimeout(resolve,1000));}if(!r.fields.file[locale].url)throw Error('Asset processing timed out');await api(`${env}/assets/${id}/published`,'PUT',undefined,r.sys.version);return ref(id,'Asset');}
let groups=[];
for(const group of defaults.alumniIndustries){let destinations=[];for(const d of group.employers){const id=`ccg-alumni-${slug(d.name)}`;const logo=await asset(`${id}-logo`,d.logo,d.name);destinations.push(await entry(id,'alumniDestination',{name:d.name,logo,surface:d.surface,invertLogo:d.invertLogo,largeLogo:d.largeLogo,showCaption:d.showCaption}));}groups.push(await entry(`ccg-industry-${group.layout}`,'alumniIndustry',{title:group.name,layout:group.layout,destinations}));console.log(`Prepared ${group.name}.`);}
const steps=[];for(const [i,step] of defaults.processSteps.entries())steps.push(await entry(`ccg-process-${i+1}`,'processStep',step));
const getName=e=>e.fields.companyName?.[locale];const norm=s=>(s||'').toLowerCase().replace(/[^a-z]/g,'');
const clients=entries.filter(e=>e.sys.contentType.sys.id==='clients');
const selected=defaults.featuredClients.map(name=>{let e=clients.find(e=>norm(getName(e))===norm(name));if(!e)throw Error(`Missing client ${name}`);return ref(e.sys.id);});
const built=clients.filter(e=>e.fields.description?.[locale]?.trim());
const featuredWork=['Uber','Grammarly','Coursera'].map(name=>built.find(e=>norm(getName(e))===norm(name))).filter(Boolean).map(e=>ref(e.sys.id));
if(featuredWork.length!==3)throw Error('Could not find all three fully built engagements.');
const page=await entry('ccg-clients-page','clientsPage',{...defaults.clientsPage,valuesImage:await asset('ccg-values-photo',defaults.clientsPage.valuesImage,'CCG members on campus'),processSteps:steps,featuredWork});
const originalHome=entries.find(e=>e.sys.contentType.sys.id==='homepage');const home=await api(`${env}/entries/${originalHome.sys.id}`);
if(home.fields.designReleaseVersion?.[locale]!==defaults.releaseVersion){const fields={...home.fields,...localized(Object.fromEntries(['whoWeAreTitle','teamTitle','alumniTitle','alumniDescription','featuredTitle','featuredDescription','featuredLinkLabel'].map(k=>[k,defaults[k]]))),...localized({clubDescription:defaults.introduction,featuredClients:selected,alumniIndustries:groups,clientsPage:page,designReleaseVersion:defaults.releaseVersion})};const r=await api(`${env}/entries/${home.sys.id}`,'PUT',{fields},home.sys.version);await api(`${env}/entries/${home.sys.id}/published`,'PUT',undefined,r.sys.version);}
console.log('CMS preparation complete. Site Rebuild Trigger was not changed. Validate the production build before merging.');
