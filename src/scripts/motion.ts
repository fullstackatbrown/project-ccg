// Progressive motion: readable without JavaScript, with reduced-motion support.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const legacyClasses = ['fade-in','animate-element','slide-in-left','slide-in-right','scale-in','slide-up-animation','text-content-animation'];
const legacy = document.querySelectorAll<HTMLElement>(legacyClasses.map(name=>`.${name}`).join(','));
legacy.forEach(element => {
 legacyClasses.forEach(name=>element.classList.remove(name));
 [...element.classList].filter(name=>/^(fade-in-delay-|delay-)/.test(name)).forEach(name=>element.classList.remove(name));
});
const hero = document.querySelector<HTMLElement>('.hero-section, [data-page-hero]');
const heroCopy = hero?.querySelector<HTMLElement>('.hero-logo, .text-content-animation, .absolute.inset-0>div');
if (hero && !reducedMotion.matches) {
 heroCopy?.animate([
  {opacity:0,transform:'translateY(20px)',filter:'blur(6px)'},
  {opacity:1,transform:'translateY(0)',filter:'blur(0)'}
 ],{duration:1000,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards',delay:100});
}
// Reveal groups in reading order, rather than animating the entire page at once.
const selectors = '[data-reveal], .annual-reports> .container, .company-logo, .member-card, #clients-section .group, section> .container>h1, .feature-copy';
const targets = [...new Set(document.querySelectorAll<HTMLElement>(selectors))];
if (!reducedMotion.matches) {
 const animations = new Map<Element,Animation>();
 const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting) {
    animations.get(entry.target)?.play();
    observer.unobserve(entry.target);
   }
  });
 },{threshold:0.10,rootMargin:'0px 0px -24px 0px'});
 targets.forEach(element=>{
  const image = element.dataset.reveal==='image';
  const siblings = [...(element.parentElement?.children || [])];
  const stagger = element.matches('.company-logo,.member-card,.club-stats>div,#clients-section .group') ? (siblings.indexOf(element)%4)*75 : 0;
  const frames = image ? [
   {opacity:.25,clipPath:'inset(12% 0 0 0 round 28px)',transform:'translateY(24px)'},
   {opacity:1,clipPath:'inset(0% 0 0 0 round 28px)',transform:'translateY(0)'}
  ] : [
   {opacity:0,transform:'translateY(32px)'},
   {opacity:1,transform:'translateY(0)'}
  ];
  const animation=element.animate(frames,{duration:image?1100:800,delay:stagger,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
  animation.pause();
  animation.onfinish = () => animation.cancel();
  animations.set(element,animation);
  observer.observe(element);
 });
 reducedMotion.addEventListener('change',event=>{if(event.matches){animations.forEach(animation=>animation.finish());observer.disconnect();}},{once:true});
}
