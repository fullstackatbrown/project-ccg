const dialog = document.querySelector<HTMLDialogElement>('#engagement-details');
if (dialog) {
 const content = dialog.querySelector<HTMLElement>('[data-project-content]')!;
 const templates = new Map([...document.querySelectorAll<HTMLTemplateElement>('[data-project-template]')].map(template => [template.dataset.projectTemplate, template]));
 let trigger: HTMLButtonElement | null = null;
 let previousOverflow = '';
 document.querySelectorAll<HTMLButtonElement>('[data-project-open]').forEach(button => button.addEventListener('click', () => {
  const template = templates.get(button.dataset.projectOpen);
  if (!template) return;
  trigger = button;
  content.replaceChildren(template.content.cloneNode(true));
  previousOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  dialog.showModal();
  dialog.scrollTop = 0;
 }));
 dialog.querySelector('[data-project-close]')?.addEventListener('click', () => dialog.close());
 dialog.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  const pointer = event as MouseEvent;
  if (event.target === dialog && (pointer.clientX < box.left || pointer.clientX > box.right || pointer.clientY < box.top || pointer.clientY > box.bottom)) dialog.close();
 });
 dialog.addEventListener('close', () => {
  document.documentElement.style.overflow = previousOverflow;
  trigger?.focus({preventScroll: true});
 });
}
