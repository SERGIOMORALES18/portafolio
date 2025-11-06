// hero-loader.js
// Load three-hero.js dynamically when appropriate (desktop & WebGL available)
function hasWebGL(){
  try{
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  }catch(e){ return false; }
}

  function _getScriptBase(){
    // try to resolve this file's URL to load the partner module relative to it
    let script = document.currentScript;
    if(!script){
      // fallback: find a script tag that looks like this loader (works for deferred scripts)
      script = Array.from(document.getElementsByTagName('script')).find(s=>/hero-loader\.js(?:\?.*)?$/.test(s.src));
    }
    try{
      return script ? new URL('.', script.src) : new URL('.', window.location.href);
    }catch(e){
      return new URL('.', window.location.href);
    }
  }

  function init(){
    // only on wide screens and when WebGL exists
    const wide = window.matchMedia('(min-width:800px)').matches;
    if(!wide || !hasWebGL()) return;

    const base = _getScriptBase();
    const moduleUrl = new URL('./three-hero.js', base).href;
    import(moduleUrl).then(m=>{
      if(typeof m.default === 'function') m.default();
    }).catch(err=>{
      console.warn('three hero failed to load', err);
    });
  }

if(document.readyState === 'loading'){
  window.addEventListener('DOMContentLoaded', init);
}else init();
