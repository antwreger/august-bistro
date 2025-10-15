function initHeroBgCarousel({
  container = '#hero-bg',
  images = [],
  interval = 6000 // default at 6s
} = {}) {
  const root = document.querySelector(container);
  if (!root || !images.length) return;

  // Build all slides up front (offscreen opacity:0)
  const els = images.map(src => {
    const img = new Image();
    img.src = src;
    img.decoding = 'async';
    img.alt = '';
    root.appendChild(img);
    return img;
  });

    // CSS guard: disable transitions until first paint
  root.classList.add('no-animate');

  let idx = 0;

  // Ensure the first slide is decoded, then show it
  const first = els[0];

(first.decode?.() ?? Promise.resolve()).finally(() => {
  first.classList.add('is-visible', 'is-zooming'); // show + start zoom
  requestAnimationFrame(() => root.classList.remove('no-animate'));
});

  async function crossfadeTo(nextIdx) {
    if (nextIdx === idx) return;
    const prev = els[idx];
    const next = els[nextIdx];

    // Make sure the next image is decoded before we show it
    try { await (next.decode?.() ?? Promise.resolve()); } catch {}

    // Overlap(show + start zoom)
    next.classList.add('is-visible', 'is-zooming');

    // next frame: fade out prev, keep its zoom (do not touch .is-zooming yet)
    requestAnimationFrame(() => {
      prev.classList.remove('is-visible');  // fades to 0, continues zooming

      // after opacity transition ends, stop zoom + reset (invisible)
      const onEnd = (e) => {
        if (e.propertyName !== 'opacity') return;
        prev.removeEventListener('transitionend', onEnd);

        const saved = prev.style.transition;
        prev.style.transition = 'none';
        prev.classList.remove('is-zooming');
        prev.style.transform = 'scale(1)';
        prev.offsetHeight;                     // reflow
        prev.style.transition = saved || '';
      };
      prev.addEventListener('transitionend', onEnd);

      idx = nextIdx;
    });
}

  function start() {
    stop();
    window._heroTimer = setInterval(() => {
      const n = (idx + 1) % els.length;
      crossfadeTo(n);
    }, interval);
  }
  function stop() {
    if (window._heroTimer) clearInterval(window._heroTimer);
    window._heroTimer = null;
  }

  start();
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroBgCarousel({
    container: '#hero-bg',
    images: [
      'images/carousel/2.png',
      'images/carousel/3.jpg',
      'images/carousel/5.jpg',
      'images/carousel/6.jpg',
      'images/carousel/7.jpg',
      'images/carousel/8.jpg',
      'images/carousel/9.jpg',
      'images/carousel/11.jpg',
    ],
    interval: 6000
  });
});