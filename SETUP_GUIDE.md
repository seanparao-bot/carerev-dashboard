# Quick Start Guide - CareRev Dashboard Setup

Follow these steps to get your dashboard running locally and deployed to the web.

## Step 1: Run Locally (5 minutes)

```bash
# Open terminal in the carerev-dashboard folder
cd carerev-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` - You should see the dashboard! 🎉

## Step 2: Set Up Database (5 minutes)

1. Open your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Click **SQL Editor** → **New Query**
4. Run this SQL (copy & paste all of it):

```sql
-- Create facilities table
CREATE TABLE IF NOT EXISTS facilities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100) NOT NULL,
  health_system VARCHAR(255),
  specialty VARCHAR(255),
  recruiting BOOLEAN DEFAULT false,
  onboarding BOOLEAN DEFAULT false,
  required_experience VARCHAR(255),
  orientation_dates TEXT,
  facility_requirements TEXT,
  dormancy_policy TEXT,
  current_employee_protocol TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE facilities;
```

5. Click **Run** ✓

## Step 3: Add Your Data (10-30 minutes)

You have two options:

### Option A: Manual Entry (Via Supabase UI)
1. In Supabase, click **Table Editor**
2. Click **facilities** table
3. Click **+ Insert row**
4. Fill in facility information
5. Repeat for each facility

### Option B: Import from Excel (Recommended)
1. Download your Excel file from SharePoint
2. Convert to CSV format
3. In Supabase, click **Import data** in the facilities table
4. Upload your CSV file

## Step 4: Test Locally

1. Visit `http://localhost:3000`
2. You should see all your facilities
3. Click **Admin Login** → use `admin@carerev.com / admin123`
4. Click **Edit Tab** and test editing a facility
5. In another browser tab, visit the same URL as a guest - you should see changes in real-time!

## Step 5: Deploy to Vercel (15 minutes)

### 5.1: Create GitHub Repository

```bash
# Initialize git
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: CareRev Dashboard"
```

Then:
1. Go to https://github.com/new
2. Create new repository named `carerev-dashboard`
3. Copy the commands GitHub gives you and paste them in terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/carerev-dashboard.git
git branch -M main
git push -u origin main
```

### 5.2: Deploy on Vercel

1. Go to https://vercel.com
2. Click **New Project**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Next.js project
5. Under **Environment Variables**, add:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://qrzyguktfyxfexnwzmfy.supabase.co`
   - Click **Add**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `sb_publishable_R9YZ5kwh-4K7_TnzSN-lKQ_Rovm1uUv`
   - Click **Add**
6. Click **Deploy**

Wait 1-2 minutes... Your app is now live! 🌐

**Your app URL will look like**: `https://carerev-dashboard.vercel.app`

## Step 6: Share & Use

- Share the Vercel URL with your team
- Everyone can access without logging in (Guest mode)
- SuperAdmin/Admin can log in and make edits
- All changes sync in real-time across all users

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Can't connect to Supabase" | Check `.env.local` has correct URL and key |
| "Can't see my data" | Make sure you added data to the `facilities` table |
| "Edits not saving" | Check browser console (F12) for errors |
| "Deployment failed" | Verify environment variables are in Vercel |
| "No real-time updates" | Restart your dev server: `npm run dev` |

## Next Steps

✅ **Done with setup?** Now you can:
- Add more states/regions to the data
- Invite team members to access it
- Customize colors in `tailwind.config.ts`
- Add more fields to the database if needed

## Need Help?

- **Supabase docs**: https://supabase.com/docs
- **Next.js docs**: https://nextjs.org/docs
- **Vercel docs**: https://vercel.com/docs

Congratulations! Your CareRev Dashboard is now live! 🚀
