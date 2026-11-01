// Pin the logo grid briefly after its introduction, using normal native scrolling.
const showcases = [...document.querySelectorAll<HTMLElement>('[data-showcase-hold]')];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const configureShowcases = () => {
 showcases.forEach(showcase => {
  const grid = showcase.querySelector<HTMLElement>('[data-showcase-grid]')!;
  showcase.classList.remove('is-held');
  showcase.style.height = '';
  showcase.style.removeProperty('--showcase-top');
  if (window.innerWidth < 960 || window.innerHeight < 680 || reduced.matches) return;
  // A taller grid can scroll fully into view before its bottom edge pauses.
  const gridHeight = grid.offsetHeight;
  const navigationBottom = (document.querySelector('.site-nav')?.getBoundingClientRect().bottom || 94) + 20;
  const top = Math.min(navigationBottom, window.innerHeight - gridHeight - 24);
  showcase.style.setProperty('--showcase-top', `${top}px`);
  showcase.style.height = `${gridHeight + window.innerHeight * .4}px`;
  showcase.classList.add('is-held');
 });
};
configureShowcases();
window.addEventListener('resize', configureShowcases, {passive: true});
reduced.addEventListener('change', configureShowcases);
document.fonts.ready.then(configureShowcases);
