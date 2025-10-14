function initFadeNearHeader(
  sectionClass = 'fade-near-header-text',
  headerSelector = 'header',
  headerMaskClass = 'is-fading' // trigger class
) {
  const header = document.querySelector(headerSelector);
  const sections = document.querySelectorAll(`.${sectionClass}`);
  if (!header || !sections.length) return;

  let ticking = false;

  function isTouchingHeaderBottom(rect, headerBottomY, eps = 0.5) {
    // Touching = header bottom line lies within the section's vertical span
    return rect.top - eps <= headerBottomY && rect.bottom + eps >= headerBottomY;
  }

  function update() {
    const hb = header.getBoundingClientRect().bottom;
    let active = false;

    for (const el of sections) {
      const r = el.getBoundingClientRect();
      if (isTouchingHeaderBottom(r, hb)) { active = true; break; }
    }

    header.classList.toggle(headerMaskClass, active);
    ticking = false;
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  initFadeNearHeader('fade-near-header-text', 'header', 'is-fading');
});