import { contentfulClient } from './contentful';
import { projectPillColor } from './projectPillColors';

export const semesterRank = (semester: string) => (Number(semester.match(/\d{4}/)?.[0]) || 0) * 10 + (/fall/i.test(semester) ? 2 : 1);

export async function loadProjectAssignments() {
 const response = await contentfulClient.getEntries({content_type:'projectAssignment', limit:1000, include:1});
 return response.items.map((entry:any) => {
  const fields = entry.fields;
  return {id:entry.sys.id, memberId:fields.member?.sys.id, projectId:fields.project?.sys.id,
   companyName:fields.project?.fields?.companyName || '', semester:fields.project?.fields?.semester || '',
   name:fields.personName, role:fields.role, order:fields.displayOrder || 0,
   colorFamily:fields.project?.fields?.pillColorFamily};
 }).filter(assignment=>assignment.projectId).sort((a,b)=>semesterRank(b.semester)-semesterRank(a.semester) || a.order-b.order);
}

export function memberProjects(assignments:any[], memberId:string) {
 return assignments.filter(assignment=>assignment.memberId===memberId && assignment.companyName)
  .filter((assignment,index,items)=>items.findIndex(item=>item.projectId===assignment.projectId)===index)
  .map(assignment=>({name:assignment.companyName, semester:assignment.semester,
   href:`/clients/?project=${encodeURIComponent(assignment.projectId)}#full-portfolio`,
   tone:projectPillColor(assignment.companyName, assignment.colorFamily)}));
}
