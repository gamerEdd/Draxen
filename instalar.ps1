# SCRIPT DE INSTALACIÓN DRAXEN - Instala todo en una sola ejecución

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  DRAXEN - INSTALACIÓN COMPLETA" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# BACKEND
Write-Host "📦 Instalando Backend..." -ForegroundColor Yellow
cd "e:\proyectos\draxen\backend"
npm install
Write-Host "✅ Backend instalado" -ForegroundColor Green
Write-Host ""

# FRONTEND
Write-Host "📦 Instalando Frontend..." -ForegroundColor Yellow
cd "e:\proyectos\draxen\frontend"
npm install
Write-Host "✅ Frontend instalado" -ForegroundColor Green
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  ✅ INSTALACIÓN COMPLETADA" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora ejecuta en TERMINAL 1:" -ForegroundColor Yellow
Write-Host "cd e:\proyectos\draxen\backend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Y en TERMINAL 2:" -ForegroundColor Yellow
Write-Host "cd e:\proyectos\draxen\frontend && npm run dev" -ForegroundColor White
Write-Host ""
