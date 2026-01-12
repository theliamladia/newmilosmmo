#!/bin/bash

echo "🎮 MEETFIGHTERSmmo Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if repo name needs updating
echo "⚠️  IMPORTANT: Before running npm install, please update vite.config.js"
echo "   Change 'base: \"/meetfightersmmo/\"' to match your GitHub repository name"
echo ""
read -p "Have you updated vite.config.js? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please update vite.config.js first, then run this script again."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Start development server: npm run dev"
    echo "   2. Build for production: npm run build"
    echo "   3. See DEPLOYMENT.md for GitHub Pages setup"
    echo ""
else
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi
