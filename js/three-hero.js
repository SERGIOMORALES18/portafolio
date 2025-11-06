// Minimal Three.js hero: rotating icosahedron with soft lighting and gentle parallax
// This module expects to be imported dynamically. It returns an init function.
export default async function initThreeHero(){
  // Respect reduced motion
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const wrap = document.getElementById('three-wrap');
  if(!wrap) return;

  // Feature detect WebGL
  function hasWebGL(){
    try{
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    }catch(e){ return false; }
  }
  if(!hasWebGL()) return;

  // Dynamically import three to keep initial load small
  const THREE = await import('https://cdn.skypack.dev/three@0.154.0');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, wrap.clientWidth / wrap.clientHeight, 0.1, 1000);
  camera.position.z = 3.2;
  const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setSize(wrap.clientWidth, wrap.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  wrap.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 0.9);
  light.position.set(5,5,5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040, 0.6));
  const rim = new THREE.DirectionalLight(0xaeeecb, 0.45);
  rim.position.set(-3,2,1);
  scene.add(rim);

  // sphere-like geometry (smooth) for a softer organic look
  const geom = new THREE.SphereGeometry(0.95, 48, 32);
  const mat = new THREE.MeshStandardMaterial({color:0xb78a4a, roughness:0.48, metalness:0.08});
  const mesh = new THREE.Mesh(geom, mat);
  scene.add(mesh);

  let pointer = {x:0,y:0};
  wrap.addEventListener('pointermove', (e)=>{
    const rect = wrap.getBoundingClientRect();
    pointer.x = (e.clientX - rect.left) / rect.width - 0.5;
    pointer.y = (e.clientY - rect.top) / rect.height - 0.5;
  });

  function onResize(){
    camera.aspect = wrap.clientWidth / wrap.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
  }
  window.addEventListener('resize', onResize);

  let raf = null;
  // slower, gentle animation
  let running = true;
  function animate(){
    if(!running) return;
    mesh.rotation.y += 0.004;
    mesh.rotation.x += 0.002;
    mesh.position.x += (pointer.x * 0.35 - mesh.position.x) * 0.06;
    mesh.position.y += (-pointer.y * 0.35 - mesh.position.y) * 0.06;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }
  animate();

  // Pause the animation when the hero is not visible or page hidden
  const heroObserver = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      running = ent.isIntersecting && (!document.hidden);
      if(running && !raf) animate();
    });
  }, {root:null,threshold:0.05});
  heroObserver.observe(wrap);

  document.addEventListener('visibilitychange', ()=>{
    running = !document.hidden;
    if(running && !raf) animate();
  });

  // Cleanup when page unloads
  window.addEventListener('pagehide', ()=>{
    if(raf) cancelAnimationFrame(raf);
    try{ renderer.dispose(); }catch(e){}
  });
}
