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

const hero = document.querySelector('.hero');
const heroNetwork = document.querySelector('.hero-network');

if (hero && !reducedMotion) {
  hero.classList.add('hero-entrance-ready');
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('hero-entered')));
  window.setTimeout(() => hero.classList.add('hero-motion-ready'), 950);
}

if (heroNetwork && !reducedMotion) {
  const networkContext = heroNetwork.getContext('2d');
  const nodes = [];
  const mobileQuery = window.matchMedia('(max-width: 720px)');
  const tabletQuery = window.matchMedia('(max-width: 1000px)');
  let networkFrame = 0;
  let resizeFrame = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let pixelRatio = 1;

  const createNetwork = () => {
    const bounds = heroNetwork.getBoundingClientRect();
    canvasWidth = Math.max(1, Math.round(bounds.width));
    canvasHeight = Math.max(1, Math.round(bounds.height));
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    heroNetwork.width = Math.round(canvasWidth * pixelRatio);
    heroNetwork.height = Math.round(canvasHeight * pixelRatio);
    networkContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const nodeCount = mobileQuery.matches ? 16 : tabletQuery.matches ? 23 : 32;
    nodes.length = nodeCount;

    for (let index = 0; index < nodeCount; index += 1) {
      nodes[index] = {
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        velocityX: (Math.random() - .5) * .12,
        velocityY: (Math.random() - .5) * .12,
        radius: 1 + Math.random() * .65
      };
    }
  };

  const drawNetwork = () => {
    networkContext.clearRect(0, 0, canvasWidth, canvasHeight);
    networkContext.lineWidth = 1;
    networkContext.strokeStyle = 'rgb(85, 169, 255)';
    const connectionDistance = mobileQuery.matches ? 105 : 150;
    const connectionLimit = connectionDistance * connectionDistance;

    for (let firstIndex = 0; firstIndex < nodes.length; firstIndex += 1) {
      const node = nodes[firstIndex];
      node.x += node.velocityX;
      node.y += node.velocityY;

      if (node.x < 0 || node.x > canvasWidth) node.velocityX *= -1;
      if (node.y < 0 || node.y > canvasHeight) node.velocityY *= -1;

      for (let secondIndex = firstIndex + 1; secondIndex < nodes.length; secondIndex += 1) {
        const otherNode = nodes[secondIndex];
        const distanceX = node.x - otherNode.x;
        const distanceY = node.y - otherNode.y;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;

        if (distanceSquared < connectionLimit) {
          networkContext.globalAlpha = .11 * (1 - distanceSquared / connectionLimit);
          networkContext.beginPath();
          networkContext.moveTo(node.x, node.y);
          networkContext.lineTo(otherNode.x, otherNode.y);
          networkContext.stroke();
        }
      }

      networkContext.globalAlpha = .32;
      networkContext.fillStyle = 'rgb(99, 224, 221)';
      networkContext.beginPath();
      networkContext.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      networkContext.fill();
    }

    networkContext.globalAlpha = 1;

    networkFrame = requestAnimationFrame(drawNetwork);
  };

  const startNetwork = () => {
    if (!networkFrame && !document.hidden) networkFrame = requestAnimationFrame(drawNetwork);
  };

  const stopNetwork = () => {
    cancelAnimationFrame(networkFrame);
    networkFrame = 0;
  };

  createNetwork();
  startNetwork();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(createNetwork);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopNetwork();
    else startNetwork();
  });
}

const revealCards = document.querySelectorAll('.skill-card, .cert-card, .project-card');
revealCards.forEach((item) => item.classList.add('reveal-item'));
const revealItems = document.querySelectorAll('.reveal, .reveal-item');

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
  document.documentElement.classList.add('reveal-ready');
  revealItems.forEach((item) => revealObserver.observe(item));
}

const projectCards = document.querySelectorAll('.project-card');
const tiltSupported = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (tiltSupported && !reducedMotion) {
  const maximumTilt = 3.5;

  projectCards.forEach((card) => {
    let tiltFrame;
    let pointerIsInside = false;

    card.addEventListener('pointerenter', () => {
      pointerIsInside = true;
      card.classList.add('is-tilting');
    });

    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const horizontalPosition = (event.clientX - bounds.left) / bounds.width - .5;
      const verticalPosition = (event.clientY - bounds.top) / bounds.height - .5;
      const rotateX = verticalPosition * maximumTilt * -2;
      const rotateY = horizontalPosition * maximumTilt * 2;

      cancelAnimationFrame(tiltFrame);
      tiltFrame = requestAnimationFrame(() => {
        if (!pointerIsInside) return;
        card.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
      });
    });

    card.addEventListener('pointerleave', () => {
      pointerIsInside = false;
      cancelAnimationFrame(tiltFrame);
      card.classList.remove('is-tilting');
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
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

const projectModals = document.querySelectorAll('.project-modal');
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

projectModals.forEach((projectModal) => {
  const projectModalClose = projectModal.querySelector('.project-modal-close');
  const projectModalOpen = document.querySelector(`[data-modal-target="${projectModal.id}"]`)
    || (projectModal.id === 'digital-forensics-project' ? document.querySelector('#open-forensics-project') : null);

  if (!projectModalClose || !projectModalOpen) return;

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
});

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
