// Native scrolling drives a pinned scene; wheel/touch behavior is never intercepted.
const desktop = window.matchMedia('(min-width: 960px) and (min-height: 680px)');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const stories = [...document.querySelectorAll<HTMLElement>('[data-scroll-story]')];
let scheduled = false;
const headerHeight = () => document.querySelector('.site-nav')?.getBoundingClientRect().height || 89;
function setScene(story:HTMLElement,index:number) {
 const panels = [...story.querySelectorAll<HTMLElement>('[data-story-panel]')];
 panels.forEach((panel,i)=>{
  const active=!story.classList.contains('is-enhanced')||i===index;
  panel.classList.toggle('is-active',i===index);
  panel.inert=!active;
  panel.setAttribute('aria-hidden',String(!active));
 });
 story.querySelectorAll('[data-story-choice]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
 story.dataset.activeScene=String(index);
}
function update() {
 scheduled=false;
 stories.forEach(story=>{
  if(!story.classList.contains('is-enhanced'))return;
  const stage=story.querySelector<HTMLElement>('.story-stage')!;
  const count=story.querySelectorAll('[data-story-panel]').length;
  const distance=story.offsetHeight-stage.offsetHeight;
  const progress=Math.max(0,Math.min(1,(headerHeight()-story.getBoundingClientRect().top)/Math.max(1,distance)));
  const index=Math.min(count-1,Math.floor(progress*count));
  if(story.dataset.activeScene!==String(index))setScene(story,index);
  story.style.setProperty('--story-progress',String(progress));
 });
}
function configure() {
 stories.forEach(story=>{
  const enabled=desktop.matches&&!reduce.matches;
  story.classList.toggle('is-enhanced',enabled);
  story.style.setProperty('--scene-count',String(story.querySelectorAll('[data-story-panel]').length));
  setScene(story,0);
 });
 update();
}
stories.forEach(story=>{
 story.querySelectorAll<HTMLButtonElement>('[data-story-choice]').forEach((button,index)=>{
  button.addEventListener('click',()=>{
   if(story.classList.contains('is-enhanced')){
    const stage=story.querySelector<HTMLElement>('.story-stage')!;
    const count=story.querySelectorAll('[data-story-panel]').length;
    const top=window.scrollY+story.getBoundingClientRect().top-headerHeight();
    window.scrollTo({top:top+(story.offsetHeight-stage.offsetHeight)*(index+.12)/count,behavior:'smooth'});
   } else {
    story.querySelectorAll<HTMLElement>('[data-story-panel]')[index]?.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'center'});
   }
  });
 });
});
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});
window.addEventListener('resize',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});
desktop.addEventListener('change',configure);
reduce.addEventListener('change',configure);
configure();
