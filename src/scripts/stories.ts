// Native scrolling drives a pinned scene; wheel/touch behavior is never intercepted.
const desktop = window.matchMedia('(min-width: 960px) and (min-height: 680px)');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const stories = [...document.querySelectorAll<HTMLElement>('[data-scroll-story]')];
let scheduled = false;
const sceneCount = (story:HTMLElement) => Number(story.dataset.scrollCount) || story.querySelectorAll('[data-story-panel]').length;
const weights = (story:HTMLElement) => [...story.querySelectorAll<HTMLElement>('[data-story-panel]')].slice(0,sceneCount(story)).map(panel=>Number(panel.dataset.scrollWeight)||1);
const sum = (values:number[]) => values.reduce((total,value)=>total+value,0);
function sizeStory(story:HTMLElement) {
 if(!story.classList.contains('people-journey')||!story.classList.contains('is-enhanced')) { story.style.height='';return; }
 const stage=story.querySelector<HTMLElement>('.story-stage')!;
 const span=(sceneCount(story)*.85*window.innerHeight-stage.offsetHeight)/sceneCount(story);
 story.style.height=`${stage.offsetHeight+span*sum(weights(story))}px`;
}
const headerHeight = () => (document.querySelector('.site-nav')?.getBoundingClientRect().bottom || 94) + 16;
function setScene(story:HTMLElement,index:number) {
 const panels = [...story.querySelectorAll<HTMLElement>('[data-story-panel]')];
 panels.forEach((panel,i)=>{
  const active=(!story.classList.contains('is-enhanced')&&!story.classList.contains('client-story'))||i===index;
  panel.classList.toggle('is-active',i===index);
  panel.inert=!active;
  panel.setAttribute('aria-hidden',String(!active));
 });
 const activeGroup=Number(panels[index]?.dataset.storyGroup ?? index);
 story.querySelectorAll('[data-story-choice]').forEach(button=>button.setAttribute('aria-pressed',String(Number((button as HTMLElement).dataset.storyChoice)===activeGroup)));
 story.dataset.activeScene=String(index);
 const selector=story.querySelector<HTMLSelectElement>('[data-client-selector]');
 if(selector)selector.value=String(index);
}
function update() {
 scheduled=false;
 stories.forEach(story=>{
  if(!story.classList.contains('is-enhanced'))return;
  sizeStory(story);
  const stage=story.querySelector<HTMLElement>('.story-stage')!;
  const count=sceneCount(story);
  const distance=story.offsetHeight-stage.offsetHeight;
  const progress=Math.max(0,Math.min(1,(headerHeight()-story.getBoundingClientRect().top)/Math.max(1,distance)));
  const durations=weights(story);
  let boundary=0;
  const weightedIndex=durations.findIndex(weight=>{boundary+=weight;return progress*sum(durations)<boundary;});
  const index=story.dataset.manualScene!==undefined ? Number(story.dataset.manualScene) : weightedIndex<0?count-1:weightedIndex;
  if(story.dataset.activeScene!==String(index))setScene(story,index);
  story.style.setProperty('--story-progress',String(progress));
 });
}
function configure() {
 stories.forEach(story=>{
  const enabled=desktop.matches&&!reduce.matches;
  story.classList.toggle('is-enhanced',enabled);
  if(story.classList.contains('client-story'))story.classList.add('is-selectable');
  story.style.setProperty('--scene-count',String(sceneCount(story)));
  sizeStory(story);
  setScene(story,0);
 });
 update();
}
stories.forEach(story=>{
 story.querySelector<HTMLSelectElement>('[data-client-selector]')?.addEventListener('change',event=>{
  const index=Number((event.target as HTMLSelectElement).value);
  story.dataset.manualScene=String(index);
  setScene(story,index);
 });
 story.querySelectorAll<HTMLButtonElement>('[data-story-choice]').forEach(button=>{
  const index=Number(button.dataset.storyChoice);
  button.addEventListener('click',()=>{
   delete story.dataset.manualScene;
   if(story.classList.contains('is-enhanced')){
    const stage=story.querySelector<HTMLElement>('.story-stage')!;
    const count=sceneCount(story);
    const top=window.scrollY+story.getBoundingClientRect().top-headerHeight();
    const durations=weights(story);
    const destination=(sum(durations.slice(0,index))+.12*durations[index])/sum(durations);
    window.scrollTo({top:top+(story.offsetHeight-stage.offsetHeight)*destination,behavior:'smooth'});
   } else if(story.classList.contains('client-story')){
    story.dataset.manualScene=String(index);
    setScene(story,index);
   } else {
    story.querySelectorAll<HTMLElement>('[data-story-panel]')[index]?.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'center'});
   }
  });
 });
});
window.addEventListener('scroll',()=>{stories.forEach(story=>delete story.dataset.manualScene);if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});
window.addEventListener('resize',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});
desktop.addEventListener('change',configure);
reduce.addEventListener('change',configure);
configure();
