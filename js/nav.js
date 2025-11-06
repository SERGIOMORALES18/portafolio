// Simple navigation toggle for small screens
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
if(navToggle && mainNav){
  navToggle.addEventListener('click', ()=>{
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('open');
  });
  // close on link click
  mainNav.addEventListener('click', (e)=>{
    if(e.target.tagName === 'A'){
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Smooth scroll for internal anchors and highlight active section
document.addEventListener('click', (e)=>{
  const a = e.target.closest('a');
  if(!a) return;
  const href = a.getAttribute('href');
  if(!href || !href.startsWith('#')) return;
  const target = document.querySelector(href);
  if(target){
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({top, behavior:'smooth'});
  }
});

// Observe sections to highlight nav links
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('#main-nav a');
if(sections.length && navLinks.length){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      const id = ent.target.id;
      const link = document.querySelector(`#main-nav a[href="#${id}"]`);
      if(link){
        if(ent.isIntersecting) link.classList.add('active');
        else link.classList.remove('active');
      }
    });
  }, {root:null,rootMargin:'-40% 0px -40% 0px',threshold:0});
  sections.forEach(s=>obs.observe(s));
}
