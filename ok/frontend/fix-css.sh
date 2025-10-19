#!/bin/bash

# CSS Fix Script for React Frontend
# This script ensures Tailwind CSS is properly configured

echo "🔧 Fixing CSS configuration..."
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")" || exit

echo "1️⃣ Cleaning up old dependencies..."
rm -rf node_modules package-lock.json .vite

echo "2️⃣ Clearing npm cache..."
npm cache clean --force

echo "3️⃣ Installing dependencies..."
npm install

echo "4️⃣ Verifying Tailwind CSS installation..."
if ! npm list tailwindcss >/dev/null 2>&1; then
    echo "   Installing Tailwind CSS..."
    npm install -D tailwindcss postcss autoprefixer
fi

echo "5️⃣ Verifying PostCSS configuration..."
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

echo "6️⃣ Verifying Tailwind configuration..."
if [ ! -f "tailwind.config.js" ]; then
    echo "   Creating tailwind.config.js..."
    npx tailwindcss init
fi

echo "7️⃣ Ensuring CSS file exists..."
if [ ! -f "src/index.css" ]; then
    echo "   Creating src/index.css..."
    cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF
fi

echo ""
echo "✅ CSS configuration fixed!"
echo ""
echo "🚀 Starting development server..."
echo ""

npm run dev
