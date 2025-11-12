// Pantalla de introducción solo la primera vez
const enterBtn = document.getElementById('enter-btn');
const intro = document.getElementById('intro');
const mainContent = document.getElementById('main-content');

function enterSite() {
  if (!intro) return;
  intro.classList.add('intro-exit');
  setTimeout(() => {
    if (intro) intro.style.display = 'none';
    if (mainContent) mainContent.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Guardar en sessionStorage que ya entró
    sessionStorage.setItem('interagro_intro_shown', 'yes');
  }, 900);
}

if (enterBtn) enterBtn.addEventListener('click', enterSite);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (intro && !intro.classList.contains('intro-exit')) enterSite();
  }
});

const introLogo = document.querySelector('#intro .intro-logo');
if (introLogo) {
  introLogo.style.cursor = 'pointer';
  introLogo.addEventListener('click', () => {
    enterSite();
  });
}

// Mostrar intro solo la primera vez
window.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('interagro_intro_shown') === 'yes') {
    if (intro) intro.style.display = 'none';
    if (mainContent) mainContent.classList.remove('hidden');
  }
});
