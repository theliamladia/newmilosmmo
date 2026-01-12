# Deployment Guide for MEETFIGHTERSmmo

## Quick Start: Deploy to GitHub Pages

### Step 1: Prepare Your Repository

1. Create a new repository on GitHub named `meetfightersmmo` (or any name you prefer)
2. **IMPORTANT:** Before pushing, update `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/meetfightersmmo/', // Change this to match your repo name!
  build: {
    outDir: 'dist',
  }
})
```

### Step 2: Push to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/meetfightersmmo.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under "Build and deployment":
   - Source: Select **GitHub Actions**
4. The GitHub Actions workflow will automatically deploy your site

### Step 4: Access Your Site

After the workflow completes (check the Actions tab), your site will be available at:
```
https://yourusername.github.io/meetfightersmmo/
```

## Alternative: Manual Deployment with gh-pages

If you prefer manual deployment:

```bash
# Install gh-pages globally
npm install -g gh-pages

# Build the project
npm run build

# Deploy to gh-pages branch
gh-pages -d dist
```

Then enable GitHub Pages with source set to `gh-pages` branch.

## Environment-Specific Configuration

### Development
- Base URL: `/` (default)
- Run with: `npm run dev`
- Access at: `http://localhost:5173`

### Production (GitHub Pages)
- Base URL: `/your-repo-name/`
- Build with: `npm run build`
- Preview with: `npm run preview`

## Troubleshooting

### Assets Not Loading

**Problem:** CSS, JS, or images not loading after deployment.

**Solution:** Ensure `base` in `vite.config.js` matches your repository name:
```javascript
base: '/exact-repo-name/',  // Must include leading and trailing slashes!
```

### Blank Page After Deployment

**Problem:** Page loads but shows blank screen.

**Solution:**
1. Check browser console for errors
2. Verify `base` path is correct
3. Ensure GitHub Pages is enabled and using correct source

### 404 Errors

**Problem:** Getting 404 errors for routes.

**Solution:** For single-page apps, GitHub Pages needs a workaround. Add a `404.html` that redirects to `index.html`:

```html
<!-- public/404.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <script>
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/meetfightersmmo/'">
  </head>
  <body>
  </body>
</html>
```

### Storage API Not Working

**Problem:** Data not persisting between sessions.

**Solution:**
- Ensure you're accessing via HTTPS (GitHub Pages uses HTTPS)
- Check if browser supports Storage API
- Verify localStorage is enabled in browser settings

## Custom Domain Setup

To use a custom domain with GitHub Pages:

1. Add a `CNAME` file to the `public` folder with your domain:
```
yourdomain.com
```

2. Configure DNS with your domain provider:
   - Add CNAME record pointing to: `yourusername.github.io`
   - Or add A records pointing to GitHub Pages IPs

3. In GitHub Settings → Pages → Custom domain, enter your domain

4. Wait for DNS propagation (can take up to 24 hours)

## Updating Your Deployment

After making changes:

```bash
# Pull latest changes (if working with others)
git pull

# Make your changes...

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

The GitHub Actions workflow will automatically rebuild and deploy.

## Manual Build Process

If you need to build locally:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test the production build locally
npm run preview
```

The build output will be in the `dist` folder.

## Performance Optimization

### Lighthouse Tips

After deployment, run Lighthouse audit and consider:

1. **Image Optimization:**
   - Use WebP format for profile photos
   - Compress images before upload
   - Consider lazy loading

2. **Code Splitting:**
   - Already handled by Vite
   - Consider route-based splitting for larger apps

3. **Caching:**
   - GitHub Pages handles this automatically
   - Browser will cache assets

## Security Considerations

⚠️ **Important Security Notes:**

1. **Password Storage:** Currently passwords are stored in plain text in browser storage. For production:
   - Never store passwords in plain text
   - Use proper authentication service (Firebase, Auth0, etc.)
   - Implement password hashing server-side

2. **Data Privacy:** 
   - User data is stored locally in browser
   - Not synced across devices
   - Clearing browser data will delete accounts

3. **Recommendations for Production:**
   - Implement proper backend authentication
   - Use HTTPS (GitHub Pages provides this)
   - Add rate limiting for login attempts
   - Implement session timeouts

## Monitoring Your Deployment

### Check Build Status
- Go to repository → Actions tab
- View workflow runs and logs
- Green checkmark = successful deployment

### View Live Site
- Click on deployment workflow
- Find "deploy" job → "Deploy to GitHub Pages" step
- Click the URL to view your site

## Need Help?

- GitHub Pages Docs: https://docs.github.com/pages
- Vite Deployment Guide: https://vitejs.dev/guide/static-deploy.html
- React Documentation: https://react.dev

## Next Steps

After successful deployment:

1. Share your site URL
2. Set up custom domain (optional)
3. Add analytics (Google Analytics, etc.)
4. Implement proper backend for production use
5. Add more game features!
