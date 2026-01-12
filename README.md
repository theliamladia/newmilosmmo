# MEETFIGHTERSmmo - Gaming Strategies

A browser-based gaming system built with React, Vite, and Tailwind CSS.

## Features

- 🔐 User authentication system with login and registration
- 👤 Profile management with photo uploads
- 📦 Inventory system
- 🎮 Activities system (Work, Crime, Slut)
- 💾 Persistent storage using browser storage API
- 🎨 Modern UI with canary yellow and steel grey color scheme

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Browser Storage API** - Data persistence

## Local Development

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/meetfightersmmo.git
cd meetfightersmmo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

Build the project:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Deploying to GitHub Pages

### Option 1: Manual Deployment

1. Update the `base` field in `vite.config.js` to match your repository name:
```javascript
base: '/your-repo-name/',
```

2. Build the project:
```bash
npm run build
```

3. Deploy the `dist` folder to GitHub Pages using gh-pages:
```bash
npm install -g gh-pages
gh-pages -d dist
```

### Option 2: GitHub Actions (Automated)

1. Create `.github/workflows/deploy.yml` in your repository with the provided workflow file

2. Push to the main branch:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

3. Go to your repository Settings → Pages → Source and select "gh-pages" branch

4. Your site will be available at: `https://yourusername.github.io/meetfightersmmo/`

## Storage System

The application uses the browser's persistent storage API to save:
- User accounts (username, password, profile data)
- User sessions
- Game progress and inventory

**Note:** Data is stored locally in the browser and persists across sessions.

## Project Structure

```
meetfightersmmo/
├── src/
│   ├── App.jsx          # Main game system component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML entry point
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── README.md           # This file
```

## Configuration

### Vite Configuration

Edit `vite.config.js` to change the base URL or build options:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Update this!
  build: {
    outDir: 'dist',
  }
})
```

### Tailwind Configuration

Customize theme colors in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      // Add custom colors
    }
  }
}
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires modern browser with ES6+ support and Storage API.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
