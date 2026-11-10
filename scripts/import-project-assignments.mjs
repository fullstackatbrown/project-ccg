import fs from 'node:fs/promises';
import {api,env,field,ref,saveEntry} from './lib/contentful-management.mjs';
const plan=JSON.parse(await fs.readFile(process.argv[2],'utf8'));
const id='projectAssignment';
if(!await api(`${env}/content_types/${id}`)){
 const model=await api(`${env}/content_types/${id}`,'PUT',{name:'Project Assignment',description:'Connect a person to a client engagement. Powers member project pills and project leadership credits.',displayField:'title',fields:[field('title','Symbol',{required:true}),field('project','Link',{linkType:'Entry',required:true,validations:[{linkContentType:['clients']}]}),field('member','Link',{linkType:'Entry',validations:[{linkContentType:['member']}]}),field('personName','Symbol',{required:true}),field('role','Symbol',{required:true,validations:[{in:['Consultant','Project Leader','Project Manager']}]}),field('displayOrder','Integer'),field('sourceNotes','Text')]});
 await api(`${env}/content_types/${id}/published`,'PUT',undefined,model.sys.version);
}
for(const row of plan){await saveEntry(row.id,id,{title:`${row.semester} | ${row.company} | ${row.name}`,project:ref(row.projectId),...(row.memberId?{member:ref(row.memberId)}:{}),personName:row.name,role:row.role,displayOrder:row.order,sourceNotes:row.source});}
console.log(`Published ${plan.length} verified project assignments. Existing member roles, bios and contact fields untouched.`);
