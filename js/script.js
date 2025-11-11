// Pantalla de introducción
const enterBtn = document.getElementById('enter-btn');
const intro = document.getElementById('intro');
const mainContent = document.getElementById('main-content');

function enterSite() {
  // añadir clase para animar la salida
  intro.classList.add('intro-exit');
  // esperar la transición CSS y luego ocultar
  setTimeout(() => {
    intro.style.display = 'none';
    mainContent.classList.remove('hidden');
    // opcional: hacer scroll al inicio del contenido
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 900);
}

enterBtn.addEventListener('click', enterSite);

// permitir pulsar Enter en teclado para entrar
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    // evitar conflicto si el menú está abierto
    if (!intro.classList.contains('intro-exit')) enterSite();
  }
});

// Menú animado
const menuBtn = document.getElementById('menu-btn');
// The markup uses a `.menu-overlay` class in CSS; query by class for robustness
const menuOverlay = document.querySelector('.menu-overlay');

// ShapeOverlays class (simplified from the reference)
class ShapeOverlays {
  constructor(elm) {
    this.elm = elm;
    this.path = elm.querySelectorAll('path');
    this.numPoints = 18;
    this.duration = 600;
    this.delayPointsArray = [];
    this.delayPointsMax = 300;
    this.delayPerPath = 100;
    this.timeStart = Date.now();
    this.isOpened = false;
    this.isAnimating = false;
  }
  toggle() {
    this.isAnimating = true;
    const range = 4 * Math.random() + 6;
    for (let i = 0; i < this.numPoints; i++) {
      const radian = i / (this.numPoints - 1) * Math.PI;
      this.delayPointsArray[i] = (Math.sin(-radian) + Math.sin(-radian * range) + 2) / 4 * this.delayPointsMax;
    }
    if (!this.isOpened) this.open(); else this.close();
  }
  open() {
    this.isOpened = true;
    this.elm.classList.add('is-opened');
    this.timeStart = Date.now();
    this.renderLoop();
    document.body.style.overflow = 'hidden';
  }
  close() {
    this.isOpened = false;
    this.elm.classList.remove('is-opened');
    this.timeStart = Date.now();
    this.renderLoop();
    document.body.style.overflow = 'visible';
  }
  updatePath(time) {
    const points = [];
    for (let i = 0; i < this.numPoints + 1; i++) {
      const t = Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1);
      points[i] = t * 100;
    }
    let str = this.isOpened ? `M 0 0 V ${points[0]} ` : `M 0 ${points[0]} `;
    for (let i = 0; i < this.numPoints - 1; i++) {
      const p = (i + 1) / (this.numPoints - 1) * 100;
      const cp = p - (1 / (this.numPoints - 1) * 100) / 2;
      str += `C ${cp} ${points[i]} ${cp} ${points[i+1]} ${p} ${points[i+1]} `;
    }
    str += this.isOpened ? `V 0 H 0` : `V 100 H 0`;
    return str;
  }
  render() {
    if (this.isOpened) {
      for (let i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * i)));
      }
    } else {
      for (let i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - i - 1))));
      }
    }
  }
  renderLoop() {
    this.render();
    if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) {
      requestAnimationFrame(() => this.renderLoop());
    } else {
      this.isAnimating = false;
    }
  }
}

// Initialize overlay if present
const shapeOverlayElm = document.querySelector('.shape-overlays');
let shapeOverlay = null;
if (shapeOverlayElm) shapeOverlay = new ShapeOverlays(shapeOverlayElm);

const globalMenuItems = document.querySelectorAll('.global-menu__item');
menuBtn.addEventListener('click', () => {
  // mostrar global-menu (antes de animar) para que los items puedan aparecer
  const globalMenu = document.querySelector('.global-menu');
  if (globalMenu) globalMenu.style.display = 'block';

  // toggle old simple overlay if present
  if (menuOverlay) menuOverlay.classList.toggle('active');

  // toggle shape overlay for a nicer effect
  if (shapeOverlay && !shapeOverlay.isAnimating) {
    shapeOverlay.toggle();
    // toggle classes on menu button and menu items
    menuBtn.classList.toggle('is-opened-navi');
    globalMenuItems.forEach((it) => it.classList.toggle('is-opened'));

    // when closing, hide the global-menu after animation finishes
    if (!shapeOverlay.isOpened) {
      // wait roughly the overlay animation time then hide
      setTimeout(() => {
        if (globalMenu) globalMenu.style.display = 'none';
      }, shapeOverlay.duration + shapeOverlay.delayPerPath * shapeOverlay.path.length + shapeOverlay.delayPointsMax);
    }
  }
});

// Close menu and navigate when a global menu item is clicked
globalMenuItems.forEach(item => {
  item.addEventListener('click', (e) => {
    const href = item.getAttribute('href');
    e.preventDefault();
    // if overlay is opened, close it first with animation
    if (shapeOverlay && shapeOverlay.isOpened) {
      shapeOverlay.toggle();
      menuBtn.classList.remove('is-opened-navi');
      globalMenuItems.forEach((it) => it.classList.remove('is-opened'));
      // navigate after animation completes
      const wait = shapeOverlay.duration + shapeOverlay.delayPerPath * shapeOverlay.path.length + shapeOverlay.delayPointsMax;
      setTimeout(() => { window.location.href = href; }, wait);
    } else {
      // fallback: navigate immediately
      window.location.href = href;
    }
  });
});

// Close button inside the new .menu-overlay (if present)
const menuCloseBtn = document.querySelector('.menu-close');
if (menuCloseBtn) {
  menuCloseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // hide simple overlay if present
    if (menuOverlay) menuOverlay.classList.remove('active');

    // if there's a shape overlay animation, toggle it (so both animations stay in sync)
    if (shapeOverlay && !shapeOverlay.isAnimating && shapeOverlay.isOpened) {
      shapeOverlay.toggle();
      menuBtn.classList.remove('is-opened-navi');
      globalMenuItems.forEach((it) => it.classList.remove('is-opened'));
      // hide the .global-menu after animation finishes (same wait used elsewhere)
      const wait = shapeOverlay.duration + shapeOverlay.delayPerPath * shapeOverlay.path.length + shapeOverlay.delayPointsMax;
      setTimeout(() => {
        const globalMenu = document.querySelector('.global-menu');
        if (globalMenu) globalMenu.style.display = 'none';
      }, wait);
    }
  });
}

// Hacer que el logo en el intro también abra el sitio si se hace click (mejora UX)
const introLogo = document.querySelector('#intro .intro-logo');
if (introLogo) {
  introLogo.style.cursor = 'pointer';
  introLogo.addEventListener('click', () => {
    enterSite();
  });
}
