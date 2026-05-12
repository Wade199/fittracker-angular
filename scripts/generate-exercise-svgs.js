/**
 * Génère les 20 SVGs d'exercices pour FitTracker
 * Usage : node scripts/generate-exercise-svgs.js
 */
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/assets/exercises');

// Définition des exercices
const exercises = [
  { file: 'pushups',           name: 'PUSH-UPS',           cat: 'CHEST · PUSH',       color: '#e94560', pose: 'horizontal' },
  { file: 'diamond-pushups',   name: 'DIAMOND PUSH-UPS',   cat: 'TRICEPS · PUSH',     color: '#e94560', pose: 'horizontal_close' },
  { file: 'pike-pushups',      name: 'PIKE PUSH-UPS',      cat: 'SHOULDERS · PUSH',   color: '#e94560', pose: 'pike' },
  { file: 'dips',              name: 'DIPS',                cat: 'CHEST · PUSH',       color: '#e94560', pose: 'dip' },
  { file: 'handstand-pushups', name: 'HANDSTAND PUSH-UPS', cat: 'SHOULDERS · PUSH',   color: '#e94560', pose: 'handstand' },
  { file: 'pullups',           name: 'PULL-UPS',            cat: 'BACK · PULL',        color: '#4a90e2', pose: 'pullup' },
  { file: 'chinups',           name: 'CHIN-UPS',            cat: 'BICEPS · PULL',      color: '#4a90e2', pose: 'pullup' },
  { file: 'australian-pullups',name: 'AUSTRALIAN PULL-UPS', cat: 'BACK · PULL',        color: '#4a90e2', pose: 'australian' },
  { file: 'muscle-ups',        name: 'MUSCLE-UPS',          cat: 'BACK · PULL',        color: '#4a90e2', pose: 'muscleup' },
  { file: 'squats',            name: 'SQUATS',              cat: 'LEGS · BEGINNER',    color: '#f39c12', pose: 'squat' },
  { file: 'jump-squats',       name: 'JUMP SQUATS',         cat: 'LEGS · INTERMEDIATE',color: '#f39c12', pose: 'jump' },
  { file: 'lunges',            name: 'LUNGES',              cat: 'LEGS · BEGINNER',    color: '#f39c12', pose: 'lunge' },
  { file: 'pistol-squats',     name: 'PISTOL SQUATS',       cat: 'LEGS · ADVANCED',    color: '#f39c12', pose: 'pistol' },
  { file: 'calf-raises',       name: 'CALF RAISES',         cat: 'CALVES · BEGINNER',  color: '#f39c12', pose: 'calf' },
  { file: 'plank',             name: 'PLANK',               cat: 'CORE · BEGINNER',    color: '#9b59b6', pose: 'plank' },
  { file: 'side-plank',        name: 'SIDE PLANK',          cat: 'CORE · INTERMEDIATE',color: '#9b59b6', pose: 'sideplank' },
  { file: 'leg-raises',        name: 'LEG RAISES',          cat: 'CORE · INTERMEDIATE',color: '#9b59b6', pose: 'legraise' },
  { file: 'crunches',          name: 'CRUNCHES',            cat: 'ABS · BEGINNER',     color: '#9b59b6', pose: 'crunch' },
  { file: 'mountain-climbers', name: 'MOUNTAIN CLIMBERS',   cat: 'CORE · BEGINNER',    color: '#9b59b6', pose: 'mountain' },
  { file: 'burpees',           name: 'BURPEES',             cat: 'FULL BODY · INTERMEDIATE', color: '#e74c3c', pose: 'burpee' },
];

// Silhouettes SVG par pose
function getPose(pose, c) {
  const poses = {
    horizontal: `<circle cx="290" cy="148" r="18" fill="${c}"/><rect x="80" y="152" width="200" height="20" rx="8" fill="${c}"/><rect x="78" y="152" width="14" height="38" rx="7" fill="${c}" transform="rotate(-12 85 171)"/><rect x="258" y="152" width="14" height="38" rx="7" fill="${c}" transform="rotate(12 265 171)"/><rect x="100" y="170" width="13" height="38" rx="6" fill="${c}"/><rect x="128" y="170" width="13" height="38" rx="6" fill="${c}"/>`,
    horizontal_close: `<circle cx="290" cy="148" r="18" fill="${c}"/><rect x="80" y="152" width="200" height="20" rx="8" fill="${c}"/><rect x="168" y="152" width="14" height="38" rx="7" fill="${c}" transform="rotate(-8 175 171)"/><rect x="188" y="152" width="14" height="38" rx="7" fill="${c}" transform="rotate(8 195 171)"/><rect x="100" y="170" width="13" height="38" rx="6" fill="${c}"/><rect x="128" y="170" width="13" height="38" rx="6" fill="${c}"/>`,
    pike: `<circle cx="200" cy="80" r="18" fill="${c}"/><rect x="185" y="98" width="16" height="50" rx="8" fill="${c}" transform="rotate(30 193 123)"/><rect x="100" y="155" width="200" height="16" rx="8" fill="${c}" transform="rotate(-20 200 163)"/><rect x="90" y="168" width="14" height="40" rx="7" fill="${c}"/><rect x="280" y="168" width="14" height="40" rx="7" fill="${c}"/>`,
    dip: `<rect x="60" y="100" width="16" height="100" rx="8" fill="rgba(245,197,24,0.3)"/><rect x="324" y="100" width="16" height="100" rx="8" fill="rgba(245,197,24,0.3)"/><rect x="60" y="100" width="280" height="14" rx="7" fill="rgba(245,197,24,0.3)"/><circle cx="200" cy="130" r="18" fill="${c}"/><rect x="188" y="148" width="24" height="35" rx="8" fill="${c}"/><rect x="155" y="110" width="14" height="45" rx="7" fill="${c}" transform="rotate(-20 162 132)"/><rect x="231" y="110" width="14" height="45" rx="7" fill="${c}" transform="rotate(20 238 132)"/><rect x="185" y="182" width="13" height="35" rx="6" fill="${c}" transform="rotate(15 191 199)"/><rect x="202" y="182" width="13" height="35" rx="6" fill="${c}" transform="rotate(-15 208 199)"/>`,
    handstand: `<circle cx="200" cy="185" r="18" fill="${c}"/><rect x="188" y="100" width="24" height="80" rx="8" fill="${c}"/><rect x="155" y="60" width="14" height="55" rx="7" fill="${c}" transform="rotate(-20 162 87)"/><rect x="231" y="60" width="14" height="55" rx="7" fill="${c}" transform="rotate(20 238 87)"/><rect x="185" y="40" width="13" height="35" rx="6" fill="${c}" transform="rotate(10 191 57)"/><rect x="202" y="40" width="13" height="35" rx="6" fill="${c}" transform="rotate(-10 208 57)"/><rect x="185" y="30" width="30" height="8" rx="4" fill="${c}"/>`,
    pullup: `<rect x="50" y="50" width="300" height="14" rx="7" fill="rgba(245,197,24,0.3)"/><circle cx="200" cy="90" r="18" fill="${c}"/><rect x="188" y="108" width="24" height="50" rx="8" fill="${c}"/><rect x="155" y="64" width="14" height="55" rx="7" fill="${c}" transform="rotate(-18 162 91)"/><rect x="231" y="64" width="14" height="55" rx="7" fill="${c}" transform="rotate(18 238 91)"/><rect x="185" y="157" width="13" height="40" rx="6" fill="${c}" transform="rotate(12 191 177)"/><rect x="202" y="157" width="13" height="40" rx="6" fill="${c}" transform="rotate(-12 208 177)"/>`,
    australian: `<rect x="50" y="80" width="300" height="14" rx="7" fill="rgba(245,197,24,0.3)"/><circle cx="200" cy="120" r="18" fill="${c}"/><rect x="80" y="118" width="240" height="20" rx="8" fill="${c}"/><rect x="78" y="118" width="14" height="35" rx="7" fill="${c}" transform="rotate(-15 85 135)"/><rect x="308" y="118" width="14" height="35" rx="7" fill="${c}" transform="rotate(15 315 135)"/><rect x="185" y="136" width="13" height="50" rx="6" fill="${c}"/><rect x="202" y="136" width="13" height="50" rx="6" fill="${c}"/>`,
    muscleup: `<rect x="50" y="50" width="300" height="14" rx="7" fill="rgba(245,197,24,0.3)"/><circle cx="200" cy="75" r="18" fill="${c}"/><rect x="188" y="93" width="24" height="45" rx="8" fill="${c}"/><rect x="148" y="57" width="14" height="50" rx="7" fill="${c}" transform="rotate(-22 155 82)"/><rect x="238" y="57" width="14" height="50" rx="7" fill="${c}" transform="rotate(22 245 82)"/><rect x="185" y="137" width="13" height="40" rx="6" fill="${c}" transform="rotate(10 191 157)"/><rect x="202" y="137" width="13" height="40" rx="6" fill="${c}" transform="rotate(-10 208 157)"/>`,
    squat: `<circle cx="200" cy="70" r="18" fill="${c}"/><rect x="188" y="88" width="24" height="40" rx="8" fill="${c}"/><rect x="155" y="95" width="14" height="40" rx="7" fill="${c}" transform="rotate(-25 162 115)"/><rect x="231" y="95" width="14" height="40" rx="7" fill="${c}" transform="rotate(25 238 115)"/><rect x="182" y="126" width="16" height="45" rx="8" fill="${c}" transform="rotate(20 190 148)"/><rect x="202" y="126" width="16" height="45" rx="8" fill="${c}" transform="rotate(-20 210 148)"/><rect x="175" y="168" width="22" height="10" rx="5" fill="${c}" transform="rotate(20 186 173)"/><rect x="203" y="168" width="22" height="10" rx="5" fill="${c}" transform="rotate(-20 214 173)"/>`,
    jump: `<circle cx="200" cy="55" r="18" fill="${c}"/><rect x="188" y="73" width="24" height="40" rx="8" fill="${c}"/><rect x="148" y="60" width="14" height="40" rx="7" fill="${c}" transform="rotate(-40 155 80)"/><rect x="238" y="60" width="14" height="40" rx="7" fill="${c}" transform="rotate(40 245 80)"/><rect x="182" y="111" width="16" height="50" rx="8" fill="${c}" transform="rotate(-15 190 136)"/><rect x="202" y="111" width="16" height="50" rx="8" fill="${c}" transform="rotate(15 210 136)"/><circle cx="185" cy="40" r="5" fill="${c}" opacity="0.5"/><circle cx="215" cy="35" r="4" fill="${c}" opacity="0.4"/><circle cx="200" cy="30" r="3" fill="${c}" opacity="0.3"/>`,
    lunge: `<circle cx="220" cy="70" r="18" fill="${c}"/><rect x="208" y="88" width="24" height="40" rx="8" fill="${c}"/><rect x="175" y="95" width="14" height="40" rx="7" fill="${c}" transform="rotate(-20 182 115)"/><rect x="245" y="95" width="14" height="40" rx="7" fill="${c}" transform="rotate(20 252 115)"/><rect x="205" y="126" width="16" height="60" rx="8" fill="${c}"/><rect x="100" y="155" width="16" height="50" rx="8" fill="${c}" transform="rotate(-30 108 180)"/><rect x="205" y="183" width="22" height="10" rx="5" fill="${c}"/><rect x="85" y="195" width="22" height="10" rx="5" fill="${c}" transform="rotate(-30 96 200)"/>`,
    pistol: `<circle cx="200" cy="70" r="18" fill="${c}"/><rect x="188" y="88" width="24" height="40" rx="8" fill="${c}"/><rect x="155" y="95" width="14" height="40" rx="7" fill="${c}" transform="rotate(-25 162 115)"/><rect x="231" y="95" width="14" height="40" rx="7" fill="${c}" transform="rotate(25 238 115)"/><rect x="195" y="126" width="16" height="60" rx="8" fill="${c}"/><rect x="100" y="130" width="16" height="55" rx="8" fill="${c}" transform="rotate(-80 108 157)"/><rect x="195" y="183" width="22" height="10" rx="5" fill="${c}"/>`,
    calf: `<circle cx="200" cy="70" r="18" fill="${c}"/><rect x="188" y="88" width="24" height="50" rx="8" fill="${c}"/><rect x="165" y="100" width="14" height="40" rx="7" fill="${c}" transform="rotate(-10 172 120)"/><rect x="221" y="100" width="14" height="40" rx="7" fill="${c}" transform="rotate(10 228 120)"/><rect x="185" y="136" width="16" height="55" rx="8" fill="${c}"/><rect x="199" y="136" width="16" height="55" rx="8" fill="${c}"/><rect x="183" y="188" width="20" height="10" rx="5" fill="${c}"/><rect x="197" y="188" width="20" height="10" rx="5" fill="${c}"/>`,
    plank: `<circle cx="80" cy="148" r="18" fill="${c}"/><rect x="80" y="155" width="240" height="20" rx="8" fill="${c}"/><rect x="78" y="155" width="14" height="38" rx="7" fill="${c}" transform="rotate(-8 85 174)"/><rect x="300" y="155" width="14" height="38" rx="7" fill="${c}" transform="rotate(8 307 174)"/><rect x="270" y="170" width="13" height="38" rx="6" fill="${c}"/><rect x="298" y="170" width="13" height="38" rx="6" fill="${c}"/>`,
    sideplank: `<circle cx="80" cy="130" r="18" fill="${c}"/><rect x="80" y="148" width="240" height="20" rx="8" fill="${c}" transform="rotate(-5 200 158)"/><rect x="78" y="148" width="14" height="38" rx="7" fill="${c}" transform="rotate(-5 85 167)"/><rect x="270" y="155" width="13" height="38" rx="6" fill="${c}" transform="rotate(-5 276 174)"/><rect x="298" y="155" width="13" height="38" rx="6" fill="${c}" transform="rotate(-5 304 174)"/><rect x="155" y="80" width="14" height="60" rx="7" fill="${c}" transform="rotate(-80 162 110)"/>`,
    legraise: `<circle cx="200" cy="80" r="18" fill="${c}"/><rect x="188" y="98" width="24" height="60" rx="8" fill="${c}"/><rect x="155" y="110" width="14" height="40" rx="7" fill="${c}" transform="rotate(-15 162 130)"/><rect x="231" y="110" width="14" height="40" rx="7" fill="${c}" transform="rotate(15 238 130)"/><rect x="185" y="156" width="16" height="55" rx="8" fill="${c}" transform="rotate(-70 193 183)"/><rect x="199" y="156" width="16" height="55" rx="8" fill="${c}" transform="rotate(-70 207 183)"/>`,
    crunch: `<circle cx="200" cy="100" r="18" fill="${c}"/><rect x="188" y="118" width="24" height="35" rx="8" fill="${c}" transform="rotate(30 200 135)"/><rect x="155" y="125" width="14" height="35" rx="7" fill="${c}" transform="rotate(20 162 142)"/><rect x="231" y="125" width="14" height="35" rx="7" fill="${c}" transform="rotate(-20 238 142)"/><rect x="185" y="155" width="16" height="50" rx="8" fill="${c}" transform="rotate(-30 193 180)"/><rect x="199" y="155" width="16" height="50" rx="8" fill="${c}" transform="rotate(-30 207 180)"/>`,
    mountain: `<circle cx="290" cy="100" r="18" fill="${c}"/><rect x="80" y="148" width="200" height="20" rx="8" fill="${c}"/><rect x="78" y="148" width="14" height="38" rx="7" fill="${c}" transform="rotate(-12 85 167)"/><rect x="258" y="148" width="14" height="38" rx="7" fill="${c}" transform="rotate(12 265 167)"/><rect x="100" y="165" width="13" height="38" rx="6" fill="${c}" transform="rotate(-30 106 184)"/><rect x="200" y="120" width="13" height="45" rx="6" fill="${c}" transform="rotate(-60 206 142)"/>`,
    burpee: `<circle cx="200" cy="55" r="18" fill="${c}"/><rect x="188" y="73" width="24" height="35" rx="8" fill="${c}"/><rect x="148" y="55" width="14" height="40" rx="7" fill="${c}" transform="rotate(-45 155 75)"/><rect x="238" y="55" width="14" height="40" rx="7" fill="${c}" transform="rotate(45 245 75)"/><rect x="182" y="106" width="16" height="45" rx="8" fill="${c}" transform="rotate(-20 190 128)"/><rect x="202" y="106" width="16" height="45" rx="8" fill="${c}" transform="rotate(20 210 128)"/>`,
  };
  return poses[pose] || poses.horizontal;
}

exercises.forEach(ex => {
  const c = ex.color;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#111100"/>
      <stop offset="100%" stop-color="#080808"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${c}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="225" fill="url(#bg)"/>
  <rect width="400" height="225" fill="url(#glow)"/>
  <!-- Sol -->
  <rect x="0" y="205" width="400" height="3" rx="1" fill="${c}" opacity="0.15"/>
  <!-- Silhouette -->
  ${getPose(ex.pose, c)}
  <!-- Titre -->
  <text x="200" y="22" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="14" font-weight="900" fill="${c}" letter-spacing="2">${ex.name}</text>
  <text x="200" y="40" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="rgba(255,255,255,0.35)" letter-spacing="2">${ex.cat}</text>
  <!-- Barre déco bas -->
  <rect x="160" y="215" width="80" height="2" rx="1" fill="${c}" opacity="0.4"/>
</svg>`;

  const file = path.join(outDir, `${ex.file}.svg`);
  fs.writeFileSync(file, svg.trim());
  console.log(`✅ ${ex.file}.svg`);
});

console.log(`\n✅ ${exercises.length} SVGs générés dans src/assets/exercises/`);
