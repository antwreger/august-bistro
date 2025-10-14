// scrollToMiddle.js
function initScrollToMiddle() {
  const links = document.querySelectorAll('a[href^="#"]');
  if (!links.length) return;

  // for custom stuffs, such as the menu
  const customScrollRules = {
    '#meny': { behavior: 'smooth', block: 'start', offset: 36 } // offset from top in pixels
  };

  links.forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();

      // check if target has custom behavior
      const rule = customScrollRules[id];

      if (rule && rule.block === 'start' && rule.offset) {
        // manual scroll for precise offset
        const rect = target.getBoundingClientRect();
        const scrollTop = window.scrollY + rect.top - rule.offset;
        window.scrollTo({ top: scrollTop, behavior: rule.behavior });
      } else {
        // default: smooth scroll to center
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }

      // optional: update the URL hash without default jump
      history.pushState(null, '', id);
    });
  });
}

document.addEventListener('DOMContentLoaded', initScrollToMiddle);