# Leonard Home Decor

A luxury e-commerce website for premium home decor and fine tableware, featuring products from leading brands including Lalique, Baccarat, Christofle, Ralph Lauren, and more.

## 🎯 Project Description

Leonard Home Decor is a modern, elegant e-commerce platform that showcases a curated collection of luxury home decor items. The website features a sophisticated design with maroon and gold branding, displaying products synced from Google Sheets to Supabase in real-time.

## ✨ Features

- **Product Catalog**: Browse luxury home decor items with detailed information
- **Brand Filtering**: Filter products by brand (Lalique, Baccarat, Christofle, etc.)
- **Price Filtering**: Filter products by price ranges
- **Image Gallery**: Product images with hover effects showing alternate views
- **Responsive Design**: Fully responsive layout optimized for desktop and mobile
- **Real-time Sync**: Automatic synchronization from Google Sheets to Supabase
- **WhatsApp Integration**: Direct contact via WhatsApp for customer inquiries
- **Luxury UI/UX**: Elegant design with sophisticated typography and animations

## 🛠 Tech Stack

- **Framework**: Next.js 16.0.5 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **External APIs**: Google Sheets API
- **Deployment**: Vercel

## 🏗 Architecture Overview

```
Google Sheets (Product Data)
    ↓
Sync Script / API Route
    ↓
Supabase Database
    ↓
Next.js Website (Frontend)
```

### Data Flow

1. **Google Sheets** stores product data (name, brand, price, stock, images)
2. **Sync Script** (`scripts/sync-sheets.ts`) or **API Route** (`app/api/sync/route.ts`) reads from Google Sheets
3. **Supabase** stores the processed product data
4. **Next.js Website** fetches and displays products from Supabase

## 📋 Prerequisites

- Node.js 18+ and npm
- Google Cloud Project with Sheets API enabled
- Supabase account and project
- Google Service Account credentials

## 🚀 Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd leonard-home-decor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Sheets Configuration
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_CREDENTIALS_PATH=./google-credentials.json

# For Vercel deployment (use base64 encoded JSON instead of file path)
# GOOGLE_CREDENTIALS_JSON=base64_encoded_credentials

# API Sync Security
SYNC_SECRET_KEY=your_secret_key_for_api_authentication
```

### 4. Google Cloud Setup

#### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**

#### Step 2: Create Service Account

1. Navigate to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Fill in the service account details
4. Click **Create and Continue**
5. Skip role assignment (or assign minimal required roles)
6. Click **Done**

#### Step 3: Generate Credentials

1. Click on the created service account
2. Go to the **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON** format
5. Download the JSON file and save it as `google-credentials.json` in the project root

#### Step 4: Share Google Sheet

1. Open your Google Sheet
2. Click **Share** button
3. Add the service account email (found in the JSON file as `client_email`)
4. Give it **Viewer** permissions
5. Copy the Sheet ID from the URL (between `/d/` and `/edit`)

### 5. Supabase Setup

#### Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Note your project URL and API keys

#### Step 2: Create Products Table

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  price NUMERIC,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url_1 TEXT,
  image_url_2 TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_products_brand ON products(brand);
```

### 6. Running Locally

#### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Manual Sync

To manually sync products from Google Sheets to Supabase:

```bash
npm run sync
```

## 🌐 Deployment (Vercel)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Import your GitHub repository
3. Configure environment variables in Vercel dashboard:
   - Add all variables from `.env.local`
   - For `GOOGLE_CREDENTIALS_JSON`, encode your credentials file:
     ```bash
     base64 -i google-credentials.json
     ```
   - Paste the base64 string as the value
4. Deploy

### Step 3: Configure API Endpoint

After deployment, your sync API will be available at:
```
https://your-domain.vercel.app/api/sync
```

## 🔄 How the Sync Works

### Manual Sync (Script)

The `scripts/sync-sheets.ts` script:

1. **Reads** product data from Google Sheets (range A2:J100)
2. **Extracts** hyperlinks for image URLs
3. **Processes** and filters products (stock > 0)
4. **Parses** prices from ruble format (₽27,000.00 → 27000.00)
5. **Deletes** all existing products from Supabase
6. **Inserts** new products in batches

### Automated Sync (API)

The `/api/sync` endpoint:

- **Accepts** POST requests with Bearer token authentication
- **Performs** the same sync operations as the script
- **Returns** JSON response with success status and product count
- **Can be triggered** from Google Apps Script or any HTTP client

#### Example API Call

```javascript
// From Google Apps Script
const response = UrlFetchApp.fetch('https://your-domain.vercel.app/api/sync', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_SYNC_SECRET_KEY'
  }
});

const result = JSON.parse(response.getContentText());
console.log(`Synced ${result.count} products`);
```

## 📁 Project Structure

```
leonard-home-decor/
├── app/
│   ├── api/
│   │   └── sync/
│   │       └── route.ts          # API endpoint for sync
│   ├── about/
│   │   └── page.tsx              # About page
│   ├── components/
│   │   └── Header.tsx            # Navigation header component
│   ├── globals.css               # Global styles and animations
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page with products
├── lib/
│   └── supabase.ts              # Supabase client configuration
├── scripts/
│   └── sync-sheets.ts           # Manual sync script
├── public/
│   └── logo.png                 # Company logo (optional)
├── .env.local                   # Environment variables (not in git)
├── google-credentials.json      # Google service account (not in git)
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🔐 Security Notes

- **Never commit** `.env.local` or `google-credentials.json` to version control
- Use **service role key** only in server-side code (API routes, scripts)
- Use **anon key** in client-side code (`lib/supabase.ts`)
- Keep `SYNC_SECRET_KEY` secure and use strong, random values
- Regularly rotate API keys and credentials

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run sync` - Manually sync products from Google Sheets

## 🎨 Design Features

- **Color Scheme**: Maroon (#722F37) and Gold (#D4AF37)
- **Typography**: Elegant serif and sans-serif font combinations
- **Animations**: Smooth fade-in and slide-up effects
- **Responsive**: Mobile-first design with breakpoints
- **Luxury Aesthetic**: Inspired by high-end brands like Lalique and Baccarat

## 🤝 Contributing

This is a private project. For questions or issues, please contact the project maintainer.

## 📄 License

MIT License

Copyright (c) 2025 Leonard Home Decor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 📞 Support

For support, email info@leonardhomedecor.com or contact via WhatsApp: +7 (995) 784-45-13

---

Built with ❤️ for luxury home decor enthusiasts
