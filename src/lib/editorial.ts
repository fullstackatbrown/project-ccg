import { contentfulClient } from './contentful';
import defaults from '../data/launchDefaults.json';

export const assetUrl = (asset:any) => {
 const url=asset?.fields?.file?.url;
 return url?.startsWith('//') ? `https:${url}` : url || '';
};
export async function loadEditorial() {
 const response=await contentfulClient.getEntries({content_type:'homepage',include:5});
 const home:any=response.items[0]?.fields || {};
 const migrated=home.designReleaseVersion===defaults.releaseVersion;
 if(import.meta.env.CONTENTFUL_REQUIRE_EDITABLE_CONTENT==='true' || process.env.GITHUB_ACTIONS==='true') {
  const referencesReady = home.featuredClients?.length > 0 && home.featuredClients.every((entry:any)=>assetUrl(entry.fields?.logo))
   && home.alumniIndustries?.length > 0 && home.alumniIndustries.every((group:any)=>group.fields?.destinations?.length > 0 && group.fields.destinations.every((entry:any)=>assetUrl(entry.fields?.logo)))
   && home.clientsPage?.fields?.processSteps?.length > 0 && home.clientsPage.fields.processSteps.every((entry:any)=>entry.fields?.title && entry.fields?.description);
  const portfolio = home.clientsPage?.fields?.portfolio;
  const portfolioReady = home.clientsPage?.fields?.portfolioReleaseVersion === '2026-11-01' && portfolio?.length > 0 && portfolio.every((entry:any)=>entry.fields?.companyName && entry.fields?.semester && entry.fields?.summary) && home.featuredClients.every((entry:any)=>portfolio.some((project:any)=>project.sys.id===entry.sys.id));
  if(!migrated || !referencesReady || !portfolioReady || !home.clubDescription?.trim()) {
   throw new Error('Contentful launch preparation is incomplete. Run the approved CMS migration before deploying the redesigned site.');
  }
 }
 const industries=migrated ? (home.alumniIndustries || []).filter((g:any)=>g.fields).map((g:any)=>({
  name:g.fields.title,layout:g.fields.layout,
  employers:(g.fields.destinations || []).filter((d:any)=>d.fields).map((d:any)=>({
   name:d.fields.name,logo:assetUrl(d.fields.logo),surface:d.fields.surface || 'white',
   invertLogo:Boolean(d.fields.invertLogo),largeLogo:Boolean(d.fields.largeLogo),showCaption:Boolean(d.fields.showCaption),
   backgroundColor:d.fields.backgroundColor,logoFit:d.fields.logoFit,logoPadding:d.fields.logoPadding,
  })),
 })) : defaults.alumniIndustries;
 const page:any=migrated ? home.clientsPage.fields : defaults.clientsPage;
 return {home,migrated,industries,page,defaults};
}
