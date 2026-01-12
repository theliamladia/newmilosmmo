# 🔷 SUPABASE SETUP GUIDE

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign in or create account
3. Click "New Project"
4. Fill in:
   - **Name:** MEETFIGHTERSmmo
   - **Database Password:** Choose a strong password
   - **Region:** Choose closest to your users
5. Click "Create new project" (takes 1-2 minutes)

## Step 2: Create Database Tables

### Create Profiles Table

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Paste this SQL:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    height TEXT,
    weight TEXT,
    profile_photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all profiles" 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, first_name, last_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text from 1 for 8)),
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

### Create Game Stats Table (Optional - for future use)

```sql
-- Create game_stats table
CREATE TABLE public.game_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    level INTEGER DEFAULT 1,
    money INTEGER DEFAULT 0,
    experience INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.game_stats ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own stats" 
    ON public.game_stats FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" 
    ON public.game_stats FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" 
    ON public.game_stats FOR UPDATE 
    USING (auth.uid() = user_id);
```

## Step 3: Get API Credentials

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click **API** in the left menu
3. You'll see:
   - **Project URL** - Copy this
   - **anon public key** - Copy this

## Step 4: Add Credentials to Your Project

### Option 1: Environment Variables (Recommended)

1. Create a `.env` file in your project root:

```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Add `.env` to your `.gitignore` (already done)

3. Replace the credentials in `src/App-Supabase.jsx`:
```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

### Option 2: Direct Replacement (Not Recommended for Production)

In `src/App-Supabase.jsx`, replace:

```javascript
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key-here';
```

**⚠️ Warning:** Never commit your actual keys to GitHub!

## Step 5: Update Your App

1. Replace `src/App.jsx` with `App-Supabase.jsx`:
```bash
cp App-Supabase.jsx src/App.jsx
```

2. Install Supabase dependency:
```bash
npm install @supabase/supabase-js
```

3. Start your dev server:
```bash
npm run dev
```

## Step 6: Configure Email (Optional but Recommended)

By default, Supabase requires email confirmation. For development:

1. Go to **Authentication** → **Providers** → **Email**
2. Scroll to **Email Settings**
3. Toggle **OFF** "Confirm email"
4. Save

For production, keep email confirmation ON!

## Step 7: Test Your App

1. Go to http://localhost:5173
2. Click "Create Account"
3. Fill in the registration form
4. Submit
5. You should be logged in!

Check Supabase:
- Go to **Authentication** → **Users** - see your new user
- Go to **Table Editor** → **profiles** - see your profile data

## 🎮 Features with Supabase

### What Works Now:
✅ User registration with Supabase Auth
✅ Secure login/logout
✅ Profile data storage
✅ Session persistence (stays logged in)
✅ Profile photos stored as base64

### What to Add Later:
- File storage for profile photos (use Supabase Storage)
- Game stats tracking
- Inventory system with database
- Real-time features
- Activity tracking

## 🔒 Security Notes

### Current Setup:
- ✅ Row Level Security enabled
- ✅ Users can only edit their own profiles
- ✅ Public profile viewing
- ✅ Secure authentication

### For Production:
- [ ] Enable email confirmation
- [ ] Set up custom SMTP
- [ ] Add rate limiting
- [ ] Implement file size limits for photos
- [ ] Add profile photo validation
- [ ] Set up proper storage for images

## 📝 Database Schema

### profiles table
```
id              UUID        (Primary Key, references auth.users)
username        TEXT        (Unique, Required)
first_name      TEXT        (Required)
last_name       TEXT        (Required)
height          TEXT        (Optional)
weight          TEXT        (Optional)
profile_photo   TEXT        (Optional, base64 string)
created_at      TIMESTAMP   (Auto)
updated_at      TIMESTAMP   (Auto)
```

## 🐛 Troubleshooting

### "Invalid API key" error
- Check that your URL and anon key are correct
- Make sure there are no extra spaces
- Verify the keys in Supabase dashboard

### "Email not confirmed" error
- Disable email confirmation in Auth settings
- Or check your email for confirmation link

### "Row Level Security" error
- Make sure you ran all the SQL commands
- Check that policies were created
- Try dropping and recreating policies

### User created but no profile
- Check if the trigger was created
- Manually run: `SELECT * FROM profiles;` in SQL Editor
- The trigger should auto-create profiles

### Cannot see profile data
- Check RLS policies
- Make sure user is authenticated
- Check browser console for errors

## 🚀 Deployment with Supabase

### For GitHub Pages:

1. Add environment variables in GitHub:
   - Go to Repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add `VITE_SUPABASE_URL` with your URL
   - Add `VITE_SUPABASE_ANON_KEY` with your key

2. Update `.github/workflows/deploy.yml`:

```yaml
- name: Build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
  run: npm run build
```

3. In Supabase, add your GitHub Pages URL to allowed URLs:
   - **Authentication** → **URL Configuration**
   - Add: `https://your-username.github.io`

## 📚 Resources

- Supabase Docs: https://supabase.com/docs
- Supabase Auth Guide: https://supabase.com/docs/guides/auth
- React + Supabase: https://supabase.com/docs/guides/getting-started/tutorials/with-react

## ✅ Checklist

Before deploying:
- [ ] Supabase project created
- [ ] Tables created with SQL
- [ ] API credentials copied
- [ ] Environment variables set
- [ ] App tested locally
- [ ] Email settings configured
- [ ] GitHub secrets added (for deployment)

## 🎉 You're All Set!

Your app now has:
- Real authentication
- Secure data storage
- Profile management
- Session persistence

Ready to add game features! 🎮
