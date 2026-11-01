import reviewProjects from '../data/portfolioReview.json';

export const portfolioReviewEnabled = import.meta.env.PORTFOLIO_REVIEW === 'true';
const normalize = (name: string) => name.toLowerCase().replace(/[^a-z]/g, '');
export function preparePortfolio(projects: any[], editorial: any) {
 const featuredIds = (editorial.home.featuredClients || []).map((entry: any) => entry.sys.id);
 const membership = editorial.page.portfolio?.map((entry:any)=>entry.sys.id) || [];
 if (!portfolioReviewEnabled && membership.length === 0) throw new Error('Publish the Contentful Clients Page portfolio before building this release.');
 const ordered = membership.map((id:string)=>projects.find(project=>project.id===id));
 if (!portfolioReviewEnabled && ordered.some((project:any)=>!project)) throw new Error('A portfolio project is unpublished or unavailable in Contentful.');
 const items = portfolioReviewEnabled
  ? reviewProjects.map(project => ({...project, logo: project.companyName === 'Education Co.' ? '' : project.logo || projects.find(p => normalize(p.companyName) === normalize(project.companyName))?.logo || ''}))
  : ordered.map(project => ({...project, semester: project.semester || '', featured: featuredIds.includes(project.id)}));
 const featured = portfolioReviewEnabled ? items.filter(project=>project.featured) : featuredIds.map((id:string)=>items.find(project=>project.id===id)).filter(Boolean);
 return {projects: items, featured, review: portfolioReviewEnabled};
}
