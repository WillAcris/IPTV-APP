#!/bin/bash

# Script de build para Render
echo "🚀 Iniciando build do IPTV App..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci

# Build do projeto
echo "🔨 Fazendo build..."
npm run build

# Verificar se dist foi criado
if [ -d "dist" ]; then
  echo "✅ Build concluído com sucesso!"
  echo "📁 Pasta dist criada com $(ls -la dist | wc -l) arquivos"
else
  echo "❌ Erro: pasta dist não foi criada!"
  exit 1
fi

echo "🎉 Build finalizado!"