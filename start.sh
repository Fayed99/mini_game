#!/bin/bash

# 🏃 Base Runner - Quick Start Script

echo "🏃 Base Runner - Setting up your game..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🎮 Starting development server..."
echo ""
echo "Game will be available at: http://localhost:3000"
echo ""
echo "Controls:"
echo "  - TAP or SPACE to jump"
echo "  - Avoid red obstacles"
echo "  - Score points for each obstacle cleared"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
