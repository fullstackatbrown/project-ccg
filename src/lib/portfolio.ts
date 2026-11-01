import reviewProjects from '../data/portfolioReview.json';

export const portfolioReviewEnabled = import.meta.env.DEV || import.meta.env.PORTFOLIO_REVIEW === 'true';
const normalize = (name: string) => name.toLowerCase().replace(/[^a-z]/g, '');
export function preparePortfolio(projects: any[], editorial: any) {
 const featuredIds = new Set((editorial.home.featuredClients || []).map((entry: any) => entry.sys.id));
 const items = portfolioReviewEnabled
  ? reviewProjects.map(project => ({...project, logo: project.companyName === 'Education Co.' ? '' : project.logo || projects.find(p => normalize(p.companyName) === normalize(project.companyName))?.logo || ''}))
  : projects.map(project => ({...project, semester: project.semester || '', featured: featuredIds.has(project.id)}));
 return {projects: items, featured: items.filter(project => project.featured), review: portfolioReviewEnabled};
}
