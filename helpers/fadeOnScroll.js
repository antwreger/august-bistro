function initFadeOnScroll(className = 'fade-on-scroll', offset = 0) {
  const els = document.querySelectorAll(`.${className}`);
  if (!els.length) return;

  let ticking = false;
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  function update() {
    const winH = window.innerHeight;
    const center = winH / 2;
    const fadeDist = winH / 2; // distance from center where fade completes

    for (const el of els) {
      const rect = el.getBoundingClientRect();
      const distFromCenter = Math.abs(rect.top + rect.height / 2 - center);
      const t = clamp(distFromCenter / fadeDist, 0, 1);

      // opacity = 1 at center, fades to 0 when out of view
      el.style.opacity = (1 - t).toFixed(3);
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
  initFadeOnScroll('fade-on-scroll', headerOffset);
});