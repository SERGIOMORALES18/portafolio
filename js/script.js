// Pantalla de introducción (intro) — keep this here; menu logic moved to js/menu_animado.js
const enterBtn = document.getElementById('enter-btn');
const intro = document.getElementById('intro');
const mainContent = document.getElementById('main-content');

function enterSite() {
  if (!intro) return;
  // añadir clase para animar la salida
  intro.classList.add('intro-exit');
  // esperar la transición CSS y luego ocultar
  setTimeout(() => {
    if (intro) intro.style.display = 'none';
    if (mainContent) mainContent.classList.remove('hidden');
    // opcional: hacer scroll al inicio del contenido
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 900);
}

if (enterBtn) enterBtn.addEventListener('click', enterSite);

// permitir pulsar Enter en teclado para entrar
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (intro && !intro.classList.contains('intro-exit')) enterSite();
  }
});

// Hacer que el logo en el intro también abra el sitio si se hace click (mejora UX)
const introLogo = document.querySelector('#intro .intro-logo');
if (introLogo) {
  introLogo.style.cursor = 'pointer';
  introLogo.addEventListener('click', () => {
    enterSite();
  });
}
