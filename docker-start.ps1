# =============================================
# SCRIPT DE LANCEMENT DOCKER — FitTracker
# Usage : .\docker-start.ps1
# =============================================

Write-Host "🐳 FitTracker — Lancement Docker" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

# Étape 1 : Copier le Dockerfile backend si pas encore fait
$backendPath = "..\streetworkout-backend"
$backendDockerfile = "$backendPath\Dockerfile"

if (-not (Test-Path $backendDockerfile)) {
    Write-Host "📋 Copie du Dockerfile backend..." -ForegroundColor Cyan
    Copy-Item "docker\backend.Dockerfile" $backendDockerfile
    Write-Host "✅ Dockerfile backend copié" -ForegroundColor Green
} else {
    Write-Host "✅ Dockerfile backend déjà présent" -ForegroundColor Green
}

# Étape 2 : Créer le .env si pas encore fait
if (-not (Test-Path ".env")) {
    Write-Host "📋 Création du fichier .env..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env créé (modifie les mots de passe si besoin)" -ForegroundColor Green
}

# Étape 3 : Build et lancement
Write-Host ""
Write-Host "🔨 Build des images Docker..." -ForegroundColor Cyan
docker compose build

Write-Host ""
Write-Host "🚀 Lancement des containers..." -ForegroundColor Cyan
docker compose up -d

Write-Host ""
Write-Host "⏳ Attente du démarrage (30s)..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

# Étape 4 : Vérification
Write-Host ""
Write-Host "📊 État des containers :" -ForegroundColor Yellow
docker compose ps

Write-Host ""
Write-Host "✅ FitTracker est lancé !" -ForegroundColor Green
Write-Host "   Frontend : http://localhost" -ForegroundColor White
Write-Host "   Backend  : http://localhost:8080/api" -ForegroundColor White
Write-Host "   Database : localhost:5432" -ForegroundColor White
Write-Host ""
Write-Host "Pour arrêter : docker compose down" -ForegroundColor Gray
Write-Host "Pour les logs : docker compose logs -f" -ForegroundColor Gray
