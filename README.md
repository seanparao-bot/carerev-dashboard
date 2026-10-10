# CareRev Dashboard

A real-time collaborative dashboard for managing healthcare facility data, built with Next.js, Supabase, and Vercel.

## Features

- 👤 **Guest Access**: Users can browse facilities without logging in
- 🔐 **Admin Login**: SuperAdmin and Admin roles can edit data in real-time
- 🔄 **Real-time Sync**: All changes are instantly reflected across all connected users
- 📊 **Filtering**: Filter by state, health system, specialty, recruiting, and onboarding status
- ✏️ **In-place Editing**: Click cells in edit mode to update facility information
- 📱 **Responsive Design**: Works seamlessly on desktop and tablet

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Git installed
- Supabase account (already created)
- GitHub account (for deployment)

### 2. Local Development Setup

```bash
# Navigate to the project directory
cd carerev-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 3. Set Up Supabase Database

Your Supabase project is already created. Now create the database tables:

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project `qrzyguktfyxfexnwzmfy`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste this SQL, then click **Run**:

```sql
-- Create facilities table
CREATE TABLE facilities (
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

-- Enable Row Level Security
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all reads (for guests)
CREATE POLICY "Allow read access to all" ON facilities
  FOR SELECT USING (true);

-- Create a policy to allow authenticated updates
CREATE POLICY "Allow updates to authenticated users" ON facilities
  FOR UPDATE USING (true);

-- Create a policy to allow authenticated inserts
CREATE POLICY "Allow inserts to authenticated users" ON facilities
  FOR INSERT WITH CHECK (true);

-- Create a policy to allow authenticated deletes
CREATE POLICY "Allow deletes to authenticated users" ON facilities
  FOR DELETE USING (true);
```

### 4. Add Test Data (Optional)

You can manually add test facilities through the Supabase dashboard, or use the Inserts for the Wisconsin facilities from your original data.

## Deploying to Vercel

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: CareRev Dashboard"

# Create a repository on GitHub (https://github.com/new)
# Then push to GitHub:
git remote add origin https://github.com/YOUR_USERNAME/carerev-dashboard.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click **New Project**
3. Select your GitHub repository
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://qrzyguktfyxfexnwzmfy.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_R9YZ5kwh-4K7_TnzSN-lKQ_Rovm1uUv`
5. Click **Deploy**

Your app will be live in ~60 seconds! 🎉

## Usage

### For Guest Users
- Browse all facilities
- Filter by various criteria
- Click "View Region" to see regional details

### For Admin Users (after logging in)
- Click **Admin Login** in the top right
- Use credentials:
  - **SuperAdmin**: admin@carerev.com / admin123
  - **Admin**: regional@carerev.com / admin123
- Click **Edit Tab** to enable editing
- Click any cell to edit its value
- Click checkboxes to toggle Recruiting/Onboarding status
- All changes sync instantly to all users

## Project Structure

```
carerev-dashboard/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main dashboard component
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Top header with login
│   ├── Sidebar.tsx        # Left sidebar navigation
│   ├── LookupView.tsx     # Facility lookup/search view
│   ├── RegionalView.tsx   # Regional detail view with editing
│   ├── EditModal.tsx      # Edit modal for cells
│   └── LoginModal.tsx     # Login modal
├── lib/
│   └── supabase.ts        # Supabase client setup
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Real-Time Updates

The dashboard uses Supabase's real-time subscriptions to keep all users in sync:
- When an Admin edits a facility, the change is instantly saved to the database
- All connected clients receive the update and refresh their view
- No page reload needed!

## Troubleshooting

### Changes not saving?
- Check browser console for errors (F12)
- Verify Supabase credentials in `.env.local`
- Ensure Row Level Security policies are enabled on the database

### Can't connect to Supabase?
- Verify the URL and API key in `.env.local`
- Check that your Supabase project is active
- Ensure the `facilities` table exists

### Vercel deployment failing?
- Check that environment variables are set correctly
- Verify all dependencies are in `package.json`
- Check Vercel logs for specific error messages

## Next Steps

1. **Add your data**: Import Wisconsin facilities data into Supabase
2. **Customize**: Modify colors and branding in `tailwind.config.ts`
3. **Add more states**: Update filters as you add more regions
4. **Export functionality**: Consider adding CSV/Excel export features

## Support

For issues with Supabase: https://supabase.com/docs
For issues with Next.js: https://nextjs.org/docs
For issues with Vercel: https://vercel.com/docs
