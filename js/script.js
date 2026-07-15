// Add a class early enough for optional, progressively enhanced animations.
document.documentElement.classList.add('js');

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = [...document.querySelectorAll('.nav-links a')];

function closeMenu() {
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.querySelector('.sr-only').textContent = 'Open navigation menu';
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
}

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navToggle.querySelector('.sr-only').textContent = isOpen ? 'Open navigation menu' : 'Close navigation menu';
  navLinks.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navItems.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navLinks.classList.contains('open')) {
    closeMenu();
    navToggle.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 720) closeMenu();
});

document.querySelector('#current-year').textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const trackedSections = [...document.querySelectorAll('main section[id]')];

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navItems.forEach((link) => {
      const isCurrent = link.hash === `#${visible.target.id}`;
      link.classList.toggle('active', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.25, 0.5] });

  trackedSections.forEach((section) => sectionObserver.observe(section));
}

const projectModal = document.querySelector('#digital-forensics-project');
const projectModalOpen = document.querySelector('#open-forensics-project');
const projectModalClose = projectModal?.querySelector('.project-modal-close');
const lightbox = document.querySelector('#digital-forensics-lightbox');
const galleryTriggers = document.querySelectorAll('.gallery-trigger');

const trapDialogFocus = (dialog, event) => {
  if (event.key !== 'Tab') return;
  const focusable = [...dialog.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

if (projectModal && projectModalOpen && projectModalClose) {
  projectModalOpen.addEventListener('click', () => {
    document.body.classList.add('modal-open');
    projectModal.showModal();
    projectModalClose.focus();
  });

  projectModalClose.addEventListener('click', () => projectModal.close());
  projectModal.addEventListener('click', (event) => {
    if (event.target === projectModal) projectModal.close();
  });
  projectModal.addEventListener('keydown', (event) => trapDialogFocus(projectModal, event));
  projectModal.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    projectModalOpen.focus();
  });
}

if (lightbox && galleryTriggers.length) {
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('#lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  let activeTrigger = null;

  galleryTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      activeTrigger = trigger;
      lightboxImage.src = trigger.dataset.image;
      lightboxImage.alt = trigger.dataset.alt;
      lightboxCaption.textContent = trigger.dataset.caption;
      lightbox.showModal();
      lightboxClose.focus();
    });
  });

  lightboxClose.addEventListener('click', () => lightbox.close());

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  lightbox.addEventListener('keydown', (event) => trapDialogFocus(lightbox, event));

  lightbox.addEventListener('close', () => {
    lightboxImage.removeAttribute('src');
    if (activeTrigger) activeTrigger.focus();
  });
}
