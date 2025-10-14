function initScrollToMiddle() {
  const links = document.querySelectorAll('a[href^="#"]');
  if (!links.length) return;

  links.forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault(); // stop browser's default jump
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      history.pushState(null, '', id);
    });
  });
}

document.addEventListener('DOMContentLoaded', initScrollToMiddle);