// A brief native-scroll hold before the longer people journey. Never capture wheel input.
const feature = document.querySelector<HTMLElement>('.featured-clients');
if (feature) {
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
 const stage = feature.querySelector<HTMLElement>('.featured-clients-stage')!;
 const content = feature.querySelector<HTMLElement>('.featured-clients-inner')!;
 const configureHold = () => {
  const eligible = window.innerWidth >= 960 && window.innerHeight >= 680 && !reduced.matches;
  feature.classList.toggle('is-held', eligible);
  feature.style.height = '';
  if (eligible && content.scrollHeight + 64 <= stage.clientHeight) {
   feature.style.height = `${stage.offsetHeight + Math.round(window.innerHeight * .35)}px`;
  } else feature.classList.remove('is-held');
 };
 configureHold();
 window.addEventListener('resize', configureHold, { passive: true });
 reduced.addEventListener('change', configureHold);
 document.fonts.ready.then(configureHold);
}
