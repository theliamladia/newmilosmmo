# MEETFIGHTERSmmo - Complete Project Structure

## 📁 Directory Structure

```
meetfightersmmo/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public/
│   └── vite.svg               # Favicon
├── src/
│   ├── App.jsx                # Main game component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles with Tailwind
├── .gitignore                 # Git ignore rules
├── DEPLOYMENT.md              # Detailed deployment guide
├── index.html                 # HTML entry point
├── LICENSE                    # MIT License
├── package.json               # Project dependencies
├── postcss.config.js          # PostCSS configuration
├── README.md                  # Project documentation
├── setup.sh                   # Setup script (Unix/Mac)
├── tailwind.config.js         # Tailwind CSS configuration
└── vite.config.js            # Vite build configuration
```

## 📋 File Descriptions

### Configuration Files

**package.json**
- Project metadata and dependencies
- Scripts for dev, build, and preview
- React 18, Vite 5, Tailwind CSS 3

**vite.config.js**
- Vite build tool configuration
- ⚠️ **MUST UPDATE** `base` to match your repo name!
- Build output settings

**tailwind.config.js**
- Tailwind CSS theme configuration
- Custom font family (Orbitron)
- Content paths for purging

**postcss.config.js**
- PostCSS plugins configuration
- Tailwind and Autoprefixer

### Source Files

**src/App.jsx**
- Main game system component
- User authentication (login/register)
- Profile management with photo upload
- Tab navigation (Home, Inventory, Activities)
- Persistent storage integration
- ~570 lines of React code

**src/main.jsx**
- React application entry point
- Renders App component to DOM

**src/index.css**
- Tailwind CSS directives
- Global styles and resets

### HTML & Assets

**index.html**
- Main HTML template
- Imports Google Fonts (Orbitron)
- Links to main.jsx

**public/vite.svg**
- Simple favicon with "M" logo
- Yellow on dark background

### Documentation

**README.md**
- Project overview and features
- Installation instructions
- Development and build commands
- Project structure
- Configuration guide

**DEPLOYMENT.md**
- Complete GitHub Pages deployment guide
- Step-by-step instructions
- Troubleshooting section
- Custom domain setup
- Security considerations

**LICENSE**
- MIT License
- Free to use and modify

### Automation

**.github/workflows/deploy.yml**
- GitHub Actions workflow
- Automatic deployment on push to main
- Build and deploy to GitHub Pages

**.gitignore**
- Excludes node_modules, dist, logs
- Editor-specific files
- OS-specific files

**setup.sh**
- Automated setup script
- Checks Node.js installation
- Reminds to update vite.config.js
- Installs dependencies

## 🚀 Quick Start Commands

```bash
# Setup (first time only)
./setup.sh

# Development
npm run dev          # Start dev server at localhost:5173
npm run build        # Build for production
npm run preview      # Preview production build

# Deployment
git add .
git commit -m "Initial commit"
git push origin main # Triggers automatic deployment
```

## ⚙️ Before Deployment Checklist

- [ ] Update `vite.config.js` base path
- [ ] Update repository URLs in README.md
- [ ] Create GitHub repository
- [ ] Enable GitHub Pages in repository settings
- [ ] Push code to GitHub
- [ ] Wait for Actions workflow to complete

## 🎨 Features Implemented

### Authentication System
- User registration with form validation
- Login with username/password
- Session persistence
- Password visibility toggle
- Logout functionality

### Profile Management
- First name, last name (in-game)
- Username (unique)
- Password (stored - needs backend for production)
- Height and weight (optional)
- Profile photo upload with preview

### UI Components
- Responsive design
- Dark theme with yellow/steel grey colors
- Smooth animations and transitions
- Custom Orbitron font for headers
- Tab navigation system
- Activity cards (Work, Crime, Slut)

### Data Persistence
- Browser Storage API integration
- User accounts saved locally
- Profile photos stored as base64
- Session management

## 🔒 Security Notes

⚠️ **Current Implementation:**
- Passwords stored in plain text in browser
- Data only stored locally
- No server-side validation

⚠️ **For Production:**
- Implement proper backend authentication
- Use password hashing (bcrypt, etc.)
- Add JWT tokens for sessions
- Implement rate limiting
- Add CSRF protection
- Use HTTPS (GitHub Pages provides this)

## 🎯 Next Steps / TODOs

1. **Backend Integration**
   - Set up authentication server
   - Database for user accounts
   - API endpoints for game data

2. **Game Features**
   - Implement Work activities
   - Implement Crime activities  
   - Implement Slut activities
   - Add inventory system
   - Add currency/money system
   - Level progression

3. **UI Enhancements**
   - Loading states
   - Error handling improvements
   - Toast notifications
   - Modal dialogs

4. **Testing**
   - Unit tests for components
   - E2E tests for user flows
   - Cross-browser testing

5. **Performance**
   - Code splitting
   - Image optimization
   - Lazy loading

## 📊 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| Vite | 5.0.8 | Build Tool |
| Tailwind CSS | 3.4.0 | Styling |
| Lucide React | 0.263.1 | Icons |
| PostCSS | 8.4.32 | CSS Processing |
| Autoprefixer | 10.4.16 | CSS Vendor Prefixes |

## 💡 Tips

**Development:**
- Hot reload is enabled
- Check console for errors
- Use React DevTools for debugging

**Styling:**
- Use Tailwind utility classes
- Custom colors: yellow-400/500 for accent
- Dark slate colors for background

**State Management:**
- Currently using React useState
- Consider Redux/Zustand for complex state

**Storage:**
- Browser Storage API has 5-10MB limit
- Consider IndexedDB for larger data

## 🐛 Common Issues

**Port already in use:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
# Or use different port
npm run dev -- --port 3000
```

**Build fails:**
- Check Node.js version (16+)
- Delete node_modules and reinstall
- Clear npm cache

**Assets not loading after deploy:**
- Verify base path in vite.config.js
- Check browser console for 404s

## 📞 Support

- Check DEPLOYMENT.md for deployment issues
- Review README.md for setup questions
- Open GitHub issue for bugs
- Check Vite docs for build problems

## 📝 Changelog

**v1.0.0 (2026-01-12)**
- Initial release
- User authentication system
- Profile management with photos
- Tab navigation UI
- Activities system foundation
- GitHub Pages deployment setup
