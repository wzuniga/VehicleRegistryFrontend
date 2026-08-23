#!/bin/bash

# Script de despliegue para VehicleRegistryBackend

# Salir si ocurre un error
set -e

echo "📂 Entrando al directorio del proyecto..."
cd VehicleRegistryFrontend

echo "⬇️ Actualizando repositorio..."
git pull

echo "📦 Instalando dependencias..."
npm install

echo "🔨 Construyendo proyecto..."
npm run build

echo "✅ Despliegue completado con éxito. Nginx sirve dist/ directo, no hace falta reiniciar nada."
