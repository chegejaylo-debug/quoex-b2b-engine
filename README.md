# Quoex B2B - Intelligent Multi-Vendor Procurement Engine

Quoex B2B (Quote Exchange Infrastructure) is a production-ready, high-utility B2B Multi-Vendor Marketplace engineered specifically for industrial supply, construction procurement, and high-volume trade networks. This application bridges cutting-edge modern web architecture with real-world trade workflows, delivering an enterprise-ready solution out of the box.

## 🚀 Core Platform Features

- **Wholesale Tiered Pricing Matrix:** Automated client-side calculations that adjust unit margins dynamically based on high-volume ordering thresholds (1-49 units base, 50+ volume tier, and 200+ bulk container brackets).
- **Omnichannel WhatsApp Dispatch API:** Integrates a zero-dependency workflow pipeline that compiles multi-item orders, aggregate payload mass, local logistics variables, and a 16% corporate VAT breakdown into a clean text manifest, broadcasting it directly to any supplier's WhatsApp chat with a single click.
- **Dynamic Regional Logistics Router:** Real-time freight calculations mapped to transport distribution hubs (e.g., Nyeri Hub, Nairobi Cross-Dock) utilizing flat baseline routes integrated with multi-item cargo weight accumulators.
- **Enterprise Multi-Dashboard Layout:**
  - **Main Marketplace Catalog:** Highly optimized layout with clean product feeds, asynchronous query debouncing (400ms lag control), and instant catalog filtering.
  - **Global RFQ Sourcing Desk:** Advanced structural forms for multi-item supply specifications, target procurement cap budgets, and project urgency tracking.
  - **Buyer Proforma Logs:** Historical transaction ledger infrastructure for corporate account auditing.
  - **Admin Control Desk:** Native catalog interface featuring live database table synchronization utilities and instant product listing deployment tools.
- **Modern Security Architecture:** Robust authentication loops powered by Clerk and multi-layer environment variable isolation.

## 🛠️ Production Tech Stack

- **Frontend Framework:** Next.js 15.2+ (App Router Architecture) utilizing Turbopack compilation.
- **Database Engine:** Supabase JS client integration layer.
- **Authentication:** Clerk Middleware & Hooks (Configured via the modern Next.js 15 `proxy.ts` layout).
- **Styling UI Components:** Tailwind CSS framework paired with Lucide React iconography.

## ⚙️ Quick Start Deployment Setup

### 1. Clone the Codebase & Install Project Packages
```bash
npm install
```

### 2. Configure Your Environment Secrets
Create an `.env.local` file in your root folder and populate these variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# M-Pesa Hook Framework (Optional Layout Ready)
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey

# Authentication Route Mapping Layouts
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 3. Clear Cache & Initialize Local Development Environment
```bash
# PowerShell Cache Clear
Remove-Item -Recurse -Force .next

# Run Server
npm run dev
```

## 🗄️ Database Schema Design (Supabase)

To link your database tables seamlessly, execute this SQL script inside your Supabase SQL Editor:

```sql
-- Create Products Table
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  price numeric not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Profiles Table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  company_name text,
  role text default 'buyer',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 📄 License & Handover Terms
Full intellectual property and repository ownership transfer upon digital asset acquisition. 
