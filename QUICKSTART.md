# 🚀 QUICK START GUIDE

## Get Your Game Live in 5 Minutes!

### Step 1: Create GitHub Repository (2 min)

1. Go to https://github.com/new
2. Repository name: `meetfightersmmo` (or your choice)
3. Keep it **Public**
4. **Do NOT** add README, .gitignore, or license (we have them)
5. Click "Create repository"

### Step 2: Update Configuration (1 min)

Open `vite.config.js` and change this line:

```javascript
base: '/meetfightersmmo/',  // Change to YOUR repo name!
```

**Example:** If your repo is named `my-game`, change to:
```javascript
base: '/my-game/',
```

### Step 3: Deploy to GitHub (2 min)

Run these commands in your project folder:

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Connect to your GitHub repo (replace with your username and repo name!)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages (30 seconds)

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - Source: Select **GitHub Actions**
5. Done! No need to save

### Step 5: Wait & Access (1 min)

1. Click the **Actions** tab in your repository
2. Wait for the green checkmark ✓ (usually takes 1-2 minutes)
3. Your site is now live at:
   ```
   https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
   ```

## 🎉 That's It!

Your game is now live and accessible from anywhere!

---

## 🛠️ Development Setup (Optional)

Want to develop locally? Follow these steps:

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Make Changes & Deploy

After making changes:

```bash
git add .
git commit -m "Describe your changes"
git push origin main
```

GitHub Actions will automatically rebuild and deploy!

---

## 📝 What You Get

✅ User registration and login system  
✅ Profile management with photo uploads  
✅ Home dashboard with stats  
✅ Inventory system (ready to populate)  
✅ Activities section (Work, Crime, Slut)  
✅ Persistent data storage  
✅ Modern UI with yellow/grey theme  
✅ Fully responsive design  
✅ Automatic deployments  

---

## ⚠️ Important Notes

**Security Warning:**
This demo stores passwords in plain text locally. For production:
- Use a proper backend (Firebase, Supabase, etc.)
- Never store real passwords this way
- Implement proper authentication

**Data Storage:**
- User data is stored in browser localStorage
- Data is not synced across devices
- Clearing browser data deletes accounts

---

## 🆘 Troubleshooting

### Blank Page After Deploy
- Check `vite.config.js` base path matches repo name
- Ensure GitHub Actions workflow completed successfully

### Assets Not Loading
- Verify base path has leading and trailing slashes: `/repo-name/`
- Clear browser cache and hard refresh (Ctrl+Shift+R)

### Build Failed in Actions
- Check Actions tab for error details
- Ensure package.json has all dependencies
- Try deleting node_modules and reinstalling locally

### Need More Help?
- Read `DEPLOYMENT.md` for detailed guide
- Read `README.md` for full documentation
- Check GitHub Actions logs for errors

---

## 🎮 Start Playing!

Once deployed, create an account and start exploring:

1. Register with username and password
2. Add your profile photo (optional)
3. Navigate between tabs
4. Check out the Activities section
5. Build your empire!

---

## 🚀 Next Steps

Now that your game is live:

1. **Customize:** Edit colors, fonts, and styling
2. **Add Features:** Implement game mechanics
3. **Backend:** Set up proper authentication
4. **Share:** Share your game URL with friends!

---

## 📚 More Documentation

- `README.md` - Full project documentation
- `DEPLOYMENT.md` - Detailed deployment guide
- `PROJECT_STRUCTURE.md` - File structure overview

---

**Have fun building your game! 🎮**
