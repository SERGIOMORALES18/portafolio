// Original Pixi demo moved to js/pixi-main.js as fallback or alternative
try {
  if (typeof PIXI === 'undefined') {
    // PIXI not available; nothing to do - script likely loaded before CDN
    console.warn('PIXI not found — skipping pixi demo');
  } else {
    const pixiApp = new PIXI.Application({
      resizeTo: window,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
    });
    const pixiWrap = document.getElementById('pixi-wrap');
    if (pixiWrap) {
      pixiWrap.appendChild(pixiApp.view);
      const container = new PIXI.Container();
      pixiApp.stage.addChild(container);
      const colors = [0x6ee7b7, 0x60a5fa, 0xf0abfc, 0xfacc15];
      // overlay subtle particles / floating highlights
      const circles = [];
      for (let i = 0; i < 10; i++) {
        const circ = new PIXI.Graphics();
        const color = colors[i % colors.length];
        circ.beginFill(color, 0.06);
        const r = 12 + Math.random() * 28;
        circ.drawCircle(0, 0, r);
        circ.endFill();
        circ.x = Math.random() * window.innerWidth;
        circ.y = Math.random() * window.innerHeight * 0.6;
        circ.scale.set(1 + Math.random() * 0.6);
        container.addChild(circ);
        circles.push({ g: circ, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.15 });
      }
      pixiApp.ticker.add((dt) => {
        for (const c of circles) {
          c.g.x += c.vx * dt;
          c.g.y += c.vy * dt;
          if (c.g.x < -50) c.g.x = window.innerWidth + 50;
          if (c.g.x > window.innerWidth + 50) c.g.x = -50;
        }
      });
    }
  }
} catch (err) {
  console.warn('pixi-main failed', err);
}
