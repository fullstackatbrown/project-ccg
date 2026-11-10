const dialog = document.querySelector<HTMLDialogElement>('#engagement-details');
if (dialog) {
 const content = dialog.querySelector<HTMLElement>('[data-project-content]')!;
 const templates = new Map([...document.querySelectorAll<HTMLTemplateElement>('[data-project-template]')].map(template => [template.dataset.projectTemplate, template]));
 let trigger: HTMLElement | null = null;
 let position = {x: 0, y: 0};
 let bodyStyle = '';
 let locked = false;
 const restorePosition = () => {
  const root = document.documentElement;
  const behavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(position.x, position.y);
  root.style.scrollBehavior = behavior;
 };
 const openProject = (projectId:string, opener:HTMLElement|null) => {
  const template = templates.get(projectId);
  if (!template || dialog.open) return;
  trigger = opener;
  position = {x: window.scrollX, y: window.scrollY};
  bodyStyle = document.body.getAttribute('style') || '';
  locked = true;
  content.replaceChildren(template.content.cloneNode(true));
  // Fix the body in its current visual position without changing the root scroll container.
  Object.assign(document.body.style, {position: 'fixed', top: `-${position.y}px`, left: `-${position.x}px`, width: '100%'});
  dialog.showModal();
  dialog.scrollTop = 0;
 };
 document.querySelectorAll<HTMLButtonElement>('[data-project-open]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.projectOpen!, button)));
 // Member pills open the matching engagement directly, including projects outside the featured set.
 const linkedProject = new URLSearchParams(window.location.search).get('project');
 if (linkedProject && templates.has(linkedProject)) {
  const opener = [...document.querySelectorAll<HTMLElement>('[data-project-open]')].find(button=>button.dataset.projectOpen===linkedProject) || null;
  const openLinkedProject = () => {
   const portfolio = document.getElementById('full-portfolio');
   if (portfolio) {
    const root = document.documentElement;
    const behavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, window.scrollY + portfolio.getBoundingClientRect().top - 110);
    root.style.scrollBehavior = behavior;
   }
   openProject(linkedProject, opener);
  };
  if (document.readyState === 'complete') openLinkedProject();
  else window.addEventListener('load', openLinkedProject, {once:true});
 }
 const unlock = () => {
  if (!locked) return;
  locked = false;
  document.body.setAttribute('style', bodyStyle);
  restorePosition();
  trigger?.focus({preventScroll: true});
  requestAnimationFrame(restorePosition);
 };
 const close = () => {dialog.close(); unlock();};
 dialog.querySelector('[data-project-close]')?.addEventListener('click', close);
 dialog.addEventListener('cancel', event => {event.preventDefault(); close();});
 dialog.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  const pointer = event as MouseEvent;
  if (event.target === dialog && (pointer.clientX < box.left || pointer.clientX > box.right || pointer.clientY < box.top || pointer.clientY > box.bottom)) close();
 });
 dialog.addEventListener('close', unlock);
}
