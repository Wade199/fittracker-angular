// =============================================
// ENVIRONNEMENT DÉVELOPPEMENT (local)
// ng serve → utilise ce fichier
// =============================================
export const environment = {
  production: false,

  // Backend Spring Boot local (hors Docker) → port 8080
  // Backend Docker                           → port 8081
  // Décommente la ligne qui correspond à ton setup :
  apiUrl: 'http://localhost:8081/api'   // ← Docker actif
  // apiUrl: 'http://localhost:8080/api' // ← Spring Boot local direct
};
