# 🚀 QUICK START - SUPABASE VERSION

## What's Different?

This version uses **Supabase** for:
- ✅ Real authentication (secure!)
- ✅ Database storage (not just browser)
- ✅ User management
- ✅ Profile data persistence across devices

## 📋 Setup Steps

### 1. Extract the ZIP (1 min)
Extract `meetfightersmmo-supabase-complete.zip` to a folder

### 2. Set Up Supabase (5 min)
Follow **SUPABASE_SETUP.md** for detailed steps, or quick version:

1. Go to https://supabase.com
2. Create new project
3. In SQL Editor, run the SQL from SUPABASE_SETUP.md
4. Get your API credentials from Settings → API

### 3. Add Your Credentials (1 min)

Create a `.env` file in your project root:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Or copy `.env.example` to `.env` and fill in your credentials.

### 4. Install & Run (2 min)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit http://localhost:5173

### 5. Test It Out! (2 min)

1. Click "Create Account"
2. Fill in the form
3. Submit
4. You're in!

Check Supabase dashboard:
- **Authentication** → Users (see your account)
- **Table Editor** → profiles (see your data)

## 🎯 For Deployment

### Add to GitHub:

1. Update `vite.config.js` (change repo name)
2. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

3. **Add GitHub Secrets:**
   - Go to Repository → Settings → Secrets → Actions
   - Add `VITE_SUPABASE_URL` with your URL
   - Add `VITE_SUPABASE_ANON_KEY` with your key

4. **Enable GitHub Pages:**
   - Settings → Pages
   - Source: GitHub Actions

5. **Update Supabase:**
   - Authentication → URL Configuration
   - Add your GitHub Pages URL

## 📁 Important Files

- `App-Supabase.jsx` - Supabase-integrated app (use this!)
- `src/App.jsx` - Currently has localStorage version
- `SUPABASE_SETUP.md` - Full setup guide
- `.env.example` - Template for credentials

## 🔄 Using the Supabase Version

Replace the current App.jsx with the Supabase version:

```bash
cp App-Supabase.jsx src/App.jsx
```

Or manually move the code from `App-Supabase.jsx` to `src/App.jsx`.

## ⚠️ White Screen Issues?

If you see a white screen:

1. **Check Console:** Open browser DevTools (F12)
2. **Missing Credentials?** Make sure `.env` file exists with correct values
3. **Supabase Project:** Verify project is created and SQL was run
4. **Check App.jsx:** Make sure you're using the Supabase version

Common fixes:
```bash
# Make sure Supabase is installed
npm install @supabase/supabase-js

# Restart dev server
npm run dev
```

## 📊 What You Get

### With LocalStorage (current src/App.jsx):
- ⚠️ Data only on current browser
- ⚠️ Not secure for production
- ✅ Works offline
- ✅ No backend needed

### With Supabase (App-Supabase.jsx):
- ✅ Data synced across devices
- ✅ Secure authentication
- ✅ Production-ready
- ✅ Real database
- ⚠️ Requires internet
- ⚠️ Needs Supabase setup

## 🎯 Recommended Workflow

**For Development/Testing:**
1. Use localStorage version (current)
2. No setup needed
3. Quick to test

**For Production:**
1. Use Supabase version
2. Follow SUPABASE_SETUP.md
3. Proper security

## 🆘 Need Help?

1. **White screen?** Check FIX_BUILD_ERROR.md
2. **Supabase issues?** Read SUPABASE_SETUP.md
3. **Deployment?** See DEPLOYMENT.md
4. **General setup?** Check README.md

## ✅ Checklist

Before deploying:
- [ ] Supabase project created
- [ ] SQL tables created
- [ ] `.env` file with credentials
- [ ] `npm install` completed
- [ ] Tested locally (`npm run dev`)
- [ ] `src/App.jsx` uses Supabase version
- [ ] GitHub secrets added
- [ ] Supabase URLs updated

## 🎮 You're Ready!

Once everything is set up, you'll have a fully-functional game with real authentication and database storage!

**Next:** Read SUPABASE_SETUP.md for detailed instructions.
