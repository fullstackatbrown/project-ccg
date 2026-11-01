// Keep each complete showcase visible for a brief stretch of native scrolling.
const showcases = [...document.querySelectorAll<HTMLElement>('[data-showcase-hold]')];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const configureShowcases = () => {
 showcases.forEach(showcase => {
  const stage = showcase.querySelector<HTMLElement>('[data-showcase-stage]')!;
  const content = showcase.querySelector<HTMLElement>('[data-showcase-content]')!;
  showcase.classList.remove('is-held');
  showcase.style.height = '';
  if (window.innerWidth < 960 || window.innerHeight < 680 || reduced.matches) return;
  const top = (document.querySelector('.site-nav')?.getBoundingClientRect().bottom || 94) + 18;
  showcase.style.setProperty('--showcase-top', `${top}px`);
  showcase.classList.add('is-held');
  if (content.getBoundingClientRect().height > stage.clientHeight - 32) {
   showcase.classList.remove('is-held');
   return;
  }
  showcase.style.height = `${stage.offsetHeight + window.innerHeight * .4}px`;
 });
};
configureShowcases();
window.addEventListener('resize', configureShowcases, {passive: true});
reduced.addEventListener('change', configureShowcases);
document.fonts.ready.then(configureShowcases);
