// Pantalla de introducción
const enterBtn = document.getElementById('enter-btn');
const intro = document.getElementById('intro');
const mainContent = document.getElementById('main-content');

enterBtn.addEventListener('click', () => {
  intro.style.opacity = '0';
  setTimeout(() => {
    intro.style.display = 'none';
    mainContent.classList.remove('hidden');
  }, 1000);
});

// Menú animado
const menuBtn = document.getElementById('menu-btn');
const overlay = document.getElementById('menu-overlay');

menuBtn.addEventListener('click', () => {
  overlay.classList.toggle('active');
});
