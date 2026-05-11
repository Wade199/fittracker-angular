// =============================================
// ENVIRONNEMENT PRODUCTION (déploiement)
// ng build --configuration production → utilise ce fichier
// =============================================
export const environment = {
  production: true,

  // ⚠️ CHANGE cette URL par l'URL réelle de ton backend déployé
  // Exemples :
  //   Railway  : 'https://fittracker-api.railway.app/api'
  //   Render   : 'https://fittracker-api.onrender.com/api'
  //   VPS      : 'https://api.tondomaine.com/api'
  //   Docker   : '/api'  ← si Nginx proxy sur le même serveur
  apiUrl: '/api'
};
