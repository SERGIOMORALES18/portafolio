
/* Menu animation and shape overlays moved from script.js */
(function () {
	// Menú animado
	const menuBtn = document.getElementById('menu-btn');
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
	if (menuBtn) {
		menuBtn.addEventListener('click', () => {
			const globalMenu = document.querySelector('.global-menu');
			if (globalMenu) globalMenu.style.display = 'block';

			if (menuOverlay) {
				menuOverlay.classList.toggle('active');
			}

			if (shapeOverlay && !shapeOverlay.isAnimating) {
				shapeOverlay.toggle();
				menuBtn.classList.toggle('is-opened-navi');
				globalMenuItems.forEach((it) => it.classList.toggle('is-opened'));

				if (!shapeOverlay.isOpened) {
					setTimeout(() => {
						if (globalMenu) globalMenu.style.display = 'none';
					}, shapeOverlay.duration + shapeOverlay.delayPerPath * shapeOverlay.path.length + shapeOverlay.delayPointsMax);
				}
			}
		});
	}

	// Close menu and navigate when a global menu item is clicked
	globalMenuItems.forEach(item => {
		item.addEventListener('click', (e) => {
			const href = item.getAttribute('href');
			e.preventDefault();
			if (shapeOverlay && shapeOverlay.isOpened) {
				shapeOverlay.toggle();
				menuBtn.classList.remove('is-opened-navi');
				globalMenuItems.forEach((it) => it.classList.remove('is-opened'));
				const wait = shapeOverlay.duration + shapeOverlay.delayPerPath * shapeOverlay.path.length + shapeOverlay.delayPointsMax;
				setTimeout(() => { window.location.href = href; }, wait);
			} else {
				window.location.href = href;
			}
		});
	});

	// Close button inside the new .menu-overlay (if present)
	const menuCloseBtn = document.querySelector('.menu-close');
	if (menuCloseBtn) {
		menuCloseBtn.addEventListener('click', (e) => {
			e.preventDefault();
			if (menuOverlay) menuOverlay.classList.remove('active');

			if (shapeOverlay && !shapeOverlay.isAnimating && shapeOverlay.isOpened) {
				shapeOverlay.toggle();
				menuBtn.classList.remove('is-opened-navi');
				globalMenuItems.forEach((it) => it.classList.remove('is-opened'));
				const wait = shapeOverlay.duration + shapeOverlay.delayPerPath * shapeOverlay.path.length + shapeOverlay.delayPointsMax;
				setTimeout(() => {
					const globalMenu = document.querySelector('.global-menu');
					if (globalMenu) globalMenu.style.display = 'none';
				}, wait);
			}
		});
	}

})();

