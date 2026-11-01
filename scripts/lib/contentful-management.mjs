import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({quiet:true});
dotenv.config({path:'.env.contentful-management.local',quiet:true});
const token=process.env.CONTENTFUL_MANAGEMENT_TOKEN;
if(!token) throw Error('Contentful management authorization is missing.');
export const space=process.env.PUBLIC_CONTENTFUL_SPACE_ID;
export const root=`https://api.contentful.com/spaces/${space}`;
export const env=`${root}/environments/master`;
export async function api(url,method='GET',body,version,extra={}) {
 const response=await fetch(url,{method,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/vnd.contentful.management.v1+json',...(version?{'X-Contentful-Version':String(version)}:{}),...extra},body:body===undefined?undefined:JSON.stringify(body)});
 if(response.status===429){await new Promise(resolve=>setTimeout(resolve,1200));return api(url,method,body,version,extra);}
 if(response.status===404)return null;
 if(!response.ok)throw Error(`Contentful ${method} ${url.split('/').slice(-2).join('/')} failed (${response.status}): ${(await response.text()).slice(0,1000)}`);
 return response.status===204?{}:response.json();
}
export async function all(kind){let items=[],skip=0;while(true){const r=await api(`${env}/${kind}?limit=100&skip=${skip}`);items.push(...r.items);skip+=r.items.length;if(skip>=r.total) return items;}}

export const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48);
export const ref=(id,linkType='Entry')=>({sys:{type:'Link',linkType,id}});
export const locale='en-US';
export const localized=fields=>Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,{[locale]:v}]));
export async function saveEntry(id,type,fields){const old=await api(`${env}/entries/${id}`);const r=await api(`${env}/entries/${id}`,'PUT',{fields:{...old?.fields,...localized(fields)}},old?.sys.version,{'X-Contentful-Content-Type':type});await api(`${env}/entries/${id}/published`,'PUT',undefined,r.sys.version);return ref(id);}
export const field=(id,type='Symbol',other={})=>({id,name:id.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase()),type,localized:false,required:false,validations:[],...other});
export async function updateModel(id,newFields){const old=await api(`${env}/content_types/${id}`);const fields=[...old.fields.map(f=>({...f,...newFields.find(n=>n.id===f.id)})),...newFields.filter(f=>!old.fields.some(o=>o.id===f.id))];const r=await api(`${env}/content_types/${id}`,'PUT',{name:old.name,displayField:old.displayField,fields},old.sys.version);await api(`${env}/content_types/${id}/published`,'PUT',undefined,r.sys.version);}
export async function asset(id,file,title){let old=await api(`${env}/assets/${id}`);if(old?.sys.publishedVersion)return ref(id,'Asset');const bytes=await fs.readFile(path.join('public',file));const upload=await fetch(`https://upload.contentful.com/spaces/${space}/uploads`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/octet-stream'},body:bytes});if(!upload.ok)throw Error(`Upload failed (${upload.status})`);const u=await upload.json();const ext=path.extname(file).toLowerCase();let r=await api(`${env}/assets/${id}`,'PUT',{fields:localized({title,file:{fileName:path.basename(file),contentType:ext==='.svg'?'image/svg+xml':ext==='.png'?'image/png':'image/jpeg',uploadFrom:ref(u.sys.id,'Upload')}})},old?.sys.version);await api(`${env}/assets/${id}/files/${locale}/process`,'PUT',undefined,r.sys.version);for(let i=0;i<30;i++){r=await api(`${env}/assets/${id}`);if(r.fields.file[locale].url)break;await new Promise(resolve=>setTimeout(resolve,1000));}if(!r.fields.file[locale].url)throw Error('Asset processing timed out');await api(`${env}/assets/${id}/published`,'PUT',undefined,r.sys.version);return ref(id,'Asset');}
