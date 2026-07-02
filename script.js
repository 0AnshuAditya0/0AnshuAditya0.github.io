const NAMESPACE = '0AnshuAditya0';
const KEY = 'portfolio-views';

function displayViews(count) {
  const el = document.getElementById('views');
  if (el) el.textContent = Number(count).toLocaleString();
}

fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
  .then(res => res.json())
  .then(data => displayViews(data.value))
  .catch(() => displayViews('—'));

function renderParticlePhoto() {
  const canvas = document.getElementById('profile-canvas');
  if (!canvas) return;

  const SIZE = 250;
  const GAP = 5;
  const MIN_ALPHA = 30;

  canvas.width = SIZE;
  canvas.height = SIZE;

  const ctx = canvas.getContext('2d');

  const offscreen = document.createElement('canvas');
  offscreen.width = SIZE;
  offscreen.height = SIZE;
  const offCtx = offscreen.getContext('2d');

  const img = new Image();
  img.src = 'a2.png';
  img.onload = function () {
    offCtx.drawImage(img, 0, 0, SIZE, SIZE);
    const data = offCtx.getImageData(0, 0, SIZE, SIZE).data;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, SIZE, SIZE);

    for (let y = 0; y < SIZE; y += GAP) {
      for (let x = 0; x < SIZE; x += GAP) {
        const idx = (y * SIZE + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        if (a < MIN_ALPHA) continue;

        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

        if (brightness < 0.08) continue;

        const radius = Math.max(0.6, brightness * (GAP * 0.7));

        const red = Math.min(255, Math.round(brightness * 255 + 60));
        const dark = Math.round(brightness * 40);

        ctx.beginPath();
        ctx.arc(x + GAP / 2, y + GAP / 2, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${red}, ${dark}, ${dark})`;
        ctx.fill();
      }
    }
  };
}

renderParticlePhoto();
