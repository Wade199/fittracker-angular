/**
 * Génère les icônes PWA FitTracker en PNG
 * Utilise Canvas API de Node.js (pas de dépendance externe)
 * Usage : node scripts/generate-icons.js
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = path.join(__dirname, '../src/assets/icons');

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const s = size;
  const r = s * 0.12; // border radius

  // Fond noir arrondi
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(s - r, 0);
  ctx.quadraticCurveTo(s, 0, s, r);
  ctx.lineTo(s, s - r);
  ctx.quadraticCurveTo(s, s, s - r, s);
  ctx.lineTo(r, s);
  ctx.quadraticCurveTo(0, s, 0, s - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fillStyle = '#080808';
  ctx.fill();

  // Cercle jaune
  const cx = s / 2, cy = s / 2;
  const cr = s * 0.38;
  ctx.beginPath();
  ctx.arc(cx, cy, cr, 0, Math.PI * 2);
  ctx.fillStyle = '#f5c518';
  ctx.fill();

  // Silhouette athlète (noir sur jaune)
  ctx.fillStyle = '#080808';
  const u = s / 100; // unité

  // Barre de traction
  ctx.fillRect(s * 0.2, s * 0.22, s * 0.6, u * 4);

  // Tête
  ctx.beginPath();
  ctx.arc(cx, s * 0.35, u * 6, 0, Math.PI * 2);
  ctx.fill();

  // Corps
  ctx.beginPath();
  ctx.roundRect(cx - u * 5, s * 0.42, u * 10, u * 14, u * 2);
  ctx.fill();

  // Bras gauche
  ctx.save();
  ctx.translate(cx - u * 8, s * 0.28);
  ctx.rotate(-0.3);
  ctx.beginPath();
  ctx.roundRect(-u * 2, 0, u * 4, u * 16, u * 2);
  ctx.fill();
  ctx.restore();

  // Bras droit
  ctx.save();
  ctx.translate(cx + u * 8, s * 0.28);
  ctx.rotate(0.3);
  ctx.beginPath();
  ctx.roundRect(-u * 2, 0, u * 4, u * 16, u * 2);
  ctx.fill();
  ctx.restore();

  // Jambe gauche
  ctx.save();
  ctx.translate(cx - u * 3, s * 0.56);
  ctx.rotate(0.15);
  ctx.beginPath();
  ctx.roundRect(-u * 2, 0, u * 4, u * 14, u * 2);
  ctx.fill();
  ctx.restore();

  // Jambe droite
  ctx.save();
  ctx.translate(cx + u * 3, s * 0.56);
  ctx.rotate(-0.15);
  ctx.beginPath();
  ctx.roundRect(-u * 2, 0, u * 4, u * 14, u * 2);
  ctx.fill();
  ctx.restore();

  // Texte "FT" en bas
  if (size >= 96) {
    ctx.fillStyle = '#f5c518';
    ctx.font = `900 ${u * 12}px Arial Black, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FT', cx, s * 0.88);
  }

  return canvas.toBuffer('image/png');
}

// Vérifier si canvas est disponible
try {
  require('canvas');
  sizes.forEach(size => {
    const buf = drawIcon(size);
    const file = path.join(outDir, `icon-${size}x${size}.png`);
    fs.writeFileSync(file, buf);
    console.log(`✅ icon-${size}x${size}.png (${Math.round(buf.length / 1024)} Ko)`);
  });
  console.log('\n✅ Toutes les icônes générées !');
} catch (e) {
  console.log('⚠️  Module canvas non disponible. Utilise le SVG à la place.');
  console.log('   Pour installer : npm install canvas');
  console.log('   Ou génère les PNG sur : https://realfavicongenerator.net');
}
