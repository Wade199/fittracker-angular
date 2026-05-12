// =============================================
// ENVIRONNEMENT PRODUCTION
// ng build --configuration production
// =============================================
export const environment = {
  production: true,

  // ── Déploiement Docker (Nginx proxy /api) ──
  apiUrl: '/api',

  // ── Déploiement cloud — décommente et adapte ──
  // apiUrl: 'https://fittracker-api.railway.app/api',
  // apiUrl: 'https://fittracker-api.onrender.com/api',
  // apiUrl: 'https://api.tondomaine.com/api',
};
