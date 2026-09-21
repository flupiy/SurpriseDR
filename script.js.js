/* ========== 1. ГОД В ФУТЕРЕ ========== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ========== 2. КОНФЕТТИ ========== */
function fireConfetti(intense = false) {
  const colors = ['#b300ff', '#d400ff', '#e6b0ff', '#8a2be2', '#ffffff', '#c77dff'];

  confetti({
    particleCount: intense ? 180 : 90,
    spread: intense ? 100 : 70,
    origin: { y: 0.6 },
    colors,
    scalar: 1.1,
    ticks: 250
  });

  setTimeout(() => {
    confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors });
  }, 200);

  if (intense) {
    const duration = 2500;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }
}

window.addEventListener('load', () => {
  setTimeout(() => fireConfetti(false), 400);
});

document.getElementById('celebrateBtn').addEventListener('click', (e) => {
  fireConfetti(true);
  const btn = e.currentTarget;
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => btn.style.transform = '', 150);
});

/* ========== 3. ТАЙМЛАЙН — ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ ========== */
const tlItems = document.querySelectorAll('.tl-item');
const tlObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
tlItems.forEach(item => tlObserver.observe(item));

/* ========== 4. LIGHTBOX ГАЛЕРЕЯ ========== */
const galleryItems = document.querySelectorAll('#galleryGrid .g-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* ========== 5. ДО / ПОСЛЕ — СЛАЙДЕР ========== */
const compare = document.getElementById('compare');
const afterImg = compare.querySelector('.after');
const handle = compare.querySelector('.handle');
let isDragging = false;

function setSplit(x) {
  const rect = compare.getBoundingClientRect();
  let percent = ((x - rect.left) / rect.width) * 100;
  percent = Math.max(0, Math.min(100, percent));
  afterImg.style.clipPath = `inset(0 0 0 ${percent}%)`;
  handle.style.left = percent + '%';
}

compare.addEventListener('mousedown', (e) => { isDragging = true; setSplit(e.clientX); });
window.addEventListener('mousemove', (e) => { if (isDragging) setSplit(e.clientX); });
window.addEventListener('mouseup', () => isDragging = false);

compare.addEventListener('touchstart', (e) => { isDragging = true; setSplit(e.touches[0].clientX); }, { passive: true });
compare.addEventListener('touchmove', (e) => { if (isDragging) setSplit(e.touches[0].clientX); }, { passive: true });
compare.addEventListener('touchend', () => isDragging = false);

setTimeout(() => {
  const rect = compare.getBoundingClientRect();
  setSplit(rect.left + rect.width * 0.5);
}, 300);

/* ========== 6. 3D ТОРТ НА THREE.JS ========== */
(function initCake() {
  const container = document.getElementById('cakeContainer');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 2.2, 7);
  camera.lookAt(0, 0.5, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x4b0082, 0.6));

  const light1 = new THREE.PointLight(0xb300ff, 3, 20);
  light1.position.set(3, 5, 4);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xd400ff, 2.5, 20);
  light2.position.set(-3, 3, 3);
  scene.add(light2);

  const light3 = new THREE.PointLight(0x8a2be2, 2, 20);
  light3.position.set(0, -2, 5);
  scene.add(light3);

  const cake = new THREE.Group();
  scene.add(cake);

  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(2.1, 2.1, 0.12, 48),
    new THREE.MeshStandardMaterial({ color: 0x1a0033, emissive: 0x4b0082, emissiveIntensity: 0.7, metalness: 0.8, roughness: 0.2 })
  );
  plate.position.y = -1.1;
  cake.add(plate);

  const layer1 = new THREE.Mesh(
    new THREE.CylinderGeometry(1.7, 1.7, 0.9, 48),
    new THREE.MeshStandardMaterial({ color: 0x2a0044, emissive: 0xb300ff, emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.4 })
  );
  layer1.position.y = -0.55;
  cake.add(layer1);

  const creamMat = new THREE.MeshStandardMaterial({ color: 0xe6b0ff, emissive: 0xd400ff, emissiveIntensity: 2, metalness: 0.3, roughness: 0.2 });
  const cream = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.07, 16, 64), creamMat);
  cream.rotation.x = Math.PI / 2;
  cream.position.y = -0.1;
  cake.add(cream);

  const layer2 = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.15, 0.75, 48),
    new THREE.MeshStandardMaterial({ color: 0x3d0066, emissive: 0x8a2be2, emissiveIntensity: 0.6, metalness: 0.4, roughness: 0.4 })
  );
  layer2.position.y = 0.45;
  cake.add(layer2);

  const cream2 = new THREE.Mesh(new THREE.TorusGeometry(1.17, 0.06, 16, 64), creamMat);
  cream2.rotation.x = Math.PI / 2;
  cream2.position.y = 0.85;
  cake.add(cream2);

  const candleCount = 5;
  const candleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xe6b0ff, emissiveIntensity: 0.8 });
  for (let i = 0; i < candleCount; i++) {
    const angle = (i / candleCount) * Math.PI * 2;
    const r = 0.65;
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.55, 12), candleMat);
    candle.position.set(Math.cos(angle) * r, 1.1, Math.sin(angle) * r);
    cake.add(candle);

    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), new THREE.MeshBasicMaterial({ color: 0xd400ff }));
    flame.position.set(Math.cos(angle) * r, 1.45, Math.sin(angle) * r);
    flame.scale.set(0.8, 1.6, 0.8);
    cake.add(flame);

    const candleLight = new THREE.PointLight(0xd400ff, 0.8, 3);
    candleLight.position.copy(flame.position);
    cake.add(candleLight);
  }

  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.03, 16, 100), new THREE.MeshBasicMaterial({ color: 0xb300ff }));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -1.05;
  cake.add(ring);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.02, 16, 100), new THREE.MeshBasicMaterial({ color: 0xd400ff }));
  ring2.rotation.x = Math.PI / 2;
  ring2.position.y = -1.05;
  cake.add(ring2);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    cake.rotation.y += 0.008;
    cake.position.y = Math.sin(t) * 0.08;
    light1.intensity = 3 + Math.sin(t * 2) * 0.8;
    light2.intensity = 2.5 + Math.cos(t * 2.2) * 0.7;
    ring.material.color.setHSL(0.78, 1, 0.5 + Math.sin(t * 3) * 0.15);
    ring2.material.color.setHSL(0.80, 1, 0.6 + Math.cos(t * 2.5) * 0.15);
    renderer.render(scene, camera);
  }
  animate();

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();
})();

/* ============================================================ */
/* ======          МУЗЫКАЛЬНЫЙ ПЛЕЕР (ЛОГИКА)          ======= */
/* ============================================================ */
(function initMusicPlayer() {
  const music = document.getElementById('bgMusic');
  const playBtn = document.getElementById('playBtn');
  const repeatBtn = document.getElementById('repeatBtn');
  const progressBar = document.getElementById('progressBar');
  const currentTimeEl = document.getElementById('currentTime');
  const durationTimeEl = document.getElementById('durationTime');
  const volumeBar = document.getElementById('volumeBar');
  const volumeIcon = document.getElementById('volumeIcon');
  const coverArt = document.getElementById('coverArt');
  const songTitle = document.getElementById('songTitle');
  const songSub = document.getElementById('songSub');

  // ====== НАСТРОЙКИ ЗДЕСЬ ======
  // Поменяйте название трека и подпись — они появятся в плеере
  const SONG_TITLE = 'Happy Birthday';
  const SONG_SUB = 'Неоновая версия';
  // =============================

  songTitle.textContent = SONG_TITLE;
  songSub.textContent = SONG_SUB;

  // Начальная громкость
  let currentVolume = 0.7;
  music.volume = currentVolume;
  volumeBar.value = currentVolume;
  updateVolumeFill(currentVolume);

  // Форматирование времени: 125 → 2:05
  function fmt(sec) {
    if (!isFinite(sec) || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Обновление цвета-заливки прогресс-бара
  function updateProgressFill(percent) {
    progressBar.style.background =
      `linear-gradient(to right, var(--neon) 0%, var(--neon-bright) ${percent}%, rgba(180,0,255,0.2) ${percent}%, rgba(180,0,255,0.2) 100%)`;
  }

  function updateVolumeFill(val) {
    const p = Math.round(val * 100);
    volumeBar.style.background =
      `linear-gradient(to right, var(--neon) 0%, var(--neon-bright) ${p}%, rgba(180,0,255,0.2) ${p}%, rgba(180,0,255,0.2) 100%)`;
  }

  // ===== Play / Pause =====
  function togglePlay() {
    if (music.paused) {
      music.play().then(() => {
        playBtn.textContent = '⏸';
        coverArt.classList.add('spin');
      }).catch(err => {
        console.warn('Не удалось воспроизвести:', err);
      });
    } else {
      music.pause();
      playBtn.textContent = '▶';
      coverArt.classList.remove('spin');
    }
  }

  playBtn.addEventListener('click', togglePlay);
  coverArt.addEventListener('click', togglePlay);
  coverArt.style.cursor = 'pointer';

  // ===== Прогресс =====
  let isSeeking = false;

  music.addEventListener('loadedmetadata', () => {
    durationTimeEl.textContent = fmt(music.duration);
    progressBar.max = music.duration || 100;
  });

  music.addEventListener('timeupdate', () => {
    if (!isSeeking) {
      progressBar.value = music.currentTime;
      currentTimeEl.textContent = fmt(music.currentTime);
      const percent = music.duration ? (music.currentTime / music.duration) * 100 : 0;
      updateProgressFill(percent);
    }
  });

  progressBar.addEventListener('input', () => {
    isSeeking = true;
    const val = parseFloat(progressBar.value);
    currentTimeEl.textContent = fmt(val);
    const percent = music.duration ? (val / music.duration) * 100 : 0;
    updateProgressFill(percent);
  });

  progressBar.addEventListener('change', () => {
    music.currentTime = parseFloat(progressBar.value);
    isSeeking = false;
  });

  progressBar.addEventListener('touchend', () => {
    music.currentTime = parseFloat(progressBar.value);
    isSeeking = false;
  });

  // ===== Громкость =====
  volumeBar.addEventListener('input', () => {
    const val = parseFloat(volumeBar.value);
    music.volume = val;
    currentVolume = val;
    updateVolumeFill(val);
    updateVolumeIcon(val);
  });

  function updateVolumeIcon(val) {
    if (val === 0) volumeIcon.textContent = '🔇';
    else if (val < 0.4) volumeIcon.textContent = '🔉';
    else volumeIcon.textContent = '🔊';
  }

  // Клик по иконке — mute/unmute
  let lastVolume = currentVolume;
  volumeIcon.addEventListener('click', () => {
    if (music.volume > 0) {
      lastVolume = music.volume;
      music.volume = 0;
      volumeBar.value = 0;
      updateVolumeFill(0);
      updateVolumeIcon(0);
    } else {
      music.volume = lastVolume || 0.7;
      volumeBar.value = music.volume;
      updateVolumeFill(music.volume);
      updateVolumeIcon(music.volume);
    }
  });

  // ===== Повтор =====
  let repeatOn = true; // по умолчанию loop вкл (атрибут loop на <audio>)
  repeatBtn.classList.add('active');

  repeatBtn.addEventListener('click', () => {
    repeatOn = !repeatOn;
    music.loop = repeatOn;
    repeatBtn.classList.toggle('active', repeatOn);
  });

  // ===== Автозапуск при первом взаимодействии =====
  function tryAutoPlay() {
    if (music.paused) {
      music.play().then(() => {
        playBtn.textContent = '⏸';
        coverArt.classList.add('spin');
      }).catch(() => {});
    }
    document.removeEventListener('click', tryAutoPlay);
    document.removeEventListener('touchstart', tryAutoPlay);
    document.removeEventListener('keydown', tryAutoPlay);
  }

  document.addEventListener('click', tryAutoPlay, { once: true });
  document.addEventListener('touchstart', tryAutoPlay, { once: true });
  document.addEventListener('keydown', tryAutoPlay, { once: true });

  // Обновление иконки play, если музыка закончилась (когда repeat выключен)
  music.addEventListener('ended', () => {
    playBtn.textContent = '▶';
    coverArt.classList.remove('spin');
  });

  // Если файл не найден
  music.addEventListener('error', () => {
    coverArt.textContent = '❌';
    songSub.textContent = 'Файл не найден — добавь music.mp3';
    playBtn.disabled = true;
    playBtn.style.opacity = 0.4;
  });
})();