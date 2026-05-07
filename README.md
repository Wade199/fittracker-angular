# 💪 FitTracker — Street Workout & Calisthenics

> **⚠️ PROPRIETARY SOFTWARE — ALL RIGHTS RESERVED**
> This project is NOT open source. See [LICENSE](./LICENSE) for details.

---

## 🏋️ Description

FitTracker est une application Angular de suivi d'entraînement street workout et calisthenics.

### Fonctionnalités
- 🔐 Authentification JWT (login / inscription)
- 🏋️ Catalogue de 20+ exercices (PUSH, PULL, LEGS, CORE)
- 📋 Création et suivi de séances d'entraînement
- 📈 Suivi de progression (poids, évolution)
- 🎨 Thème futuriste noir / jaune néon

---

## 🛠️ Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Angular 16 |
| Backend | Spring Boot 3 + JWT |
| Base de données | PostgreSQL |
| Style | CSS custom — thème futuriste |

---

## 🚀 Lancement

### Prérequis
- Node.js 18+
- Angular CLI 16
- Java 17+
- PostgreSQL 14+

### Frontend
```bash
npm install
ng serve
```
Accès : http://localhost:4200

### Backend
```bash
cd streetworkout-backend
mvn spring-boot:run
```
API : http://localhost:8080/api

---

## 📡 Endpoints API principaux

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Inscription |
| POST | `/api/auth/login` | ❌ | Connexion |
| GET | `/api/exercises` | ❌ | Liste exercices |
| GET | `/api/workouts` | ✅ | Mes séances |
| POST | `/api/workouts` | ✅ | Créer une séance |
| GET | `/api/progress` | ✅ | Ma progression |

---

## ⚖️ Licence

**Copyright © 2026 Wade199. Tous droits réservés.**

Ce logiciel est propriétaire. Toute utilisation, copie, modification ou distribution
sans autorisation écrite explicite est strictement interdite.

Voir le fichier [LICENSE](./LICENSE) pour les détails complets.
