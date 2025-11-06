// Page transitions (fade out on internal link click, fade in on load)
if(!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
  // Show page when DOM ready or when restored from bfcache
  function showPage(){
    document.body.classList.remove('is-exiting');
    document.body.classList.add('page-ready');
  }

  document.addEventListener('DOMContentLoaded', showPage);
  window.addEventListener('pageshow', (ev)=>{
    // pageshow covers navigation back from bfcache (ev.persisted)
    showPage();
  });

  // Intercept internal link clicks
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href');
    if(!href) return;
    // skip anchors, downloads, targets and special schemes
    const skipSchemes = ['#', 'mailto:', 'tel:', 'javascript:'];
    if(skipSchemes.some(s => href.startsWith(s)) || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(href, window.location.href);
    if(url.origin !== window.location.origin) return;
    // Allow normal modifier keys
    if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    // add exit class then navigate — use assign to push a normal history entry
    document.body.classList.add('is-exiting');
    setTimeout(()=> window.location.assign(url.href), 300);
  }, true);

  // When user navigates with back/forward, ensure classes are reset
  window.addEventListener('popstate', ()=>{
    // remove exiting state so the previous page is visible
    showPage();
  });
}
