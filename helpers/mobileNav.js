// helpers/mobileNav.js
(() => {
  // Mobile nav toggler — minimal, no dependency
  const onReady = () => {
    const burger  = document.getElementById('hamburger');
    const nav     = document.getElementById('primary-nav');
    const overlay = document.getElementById('nav-overlay');

    if (!burger || !nav || !overlay) return; // fail-safe

    function setOpen(isOpen) {
      nav.classList.toggle('open', isOpen);
      burger.classList.toggle('is-active', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      overlay.hidden = !isOpen;
      if (isOpen) {
        const firstLink = nav.querySelector('a, button, select');
        if (firstLink) firstLink.focus();
      }
    }

    burger.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    overlay.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    nav.addEventListener('click', (e) => { if (e.target.matches('a')) setOpen(false); });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady, { once: true });
  } else {
    onReady();
  }
})();