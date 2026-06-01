# Nuvrixa Website

Official Nuvrixa website built with React, Vite and Supabase.

Nuvrixa helps businesses, organisations and community-driven teams move from scattered information, manual admin and disconnected tools into clear AI-powered systems. The website introduces Nuvrixa services, displays package information from Supabase, and allows potential clients to submit consultation requests.

## Project Overview

This repository contains the Phase 1 public website for Nuvrixa.

Phase 1 focuses on the public-facing website:

- Home section
- Services section
- Packages section
- Book Consultation section
- Supabase connection
- Vercel deployment readiness
- Responsive design

Future phases will add:

- Client authentication
- Client dashboard
- Project tracking
- Ticket system
- Knowledge base
- Admin portal
- AI-assisted workflows

## Tech Stack

- React
- Vite
- Supabase
- Vercel
- Lucide React icons

## Features

### Public Website

- Premium Nuvrixa landing page
- AI business systems positioning
- Services overview
- Package display
- Consultation booking flow
- Responsive design for mobile, tablet and desktop

### Supabase Integration

The frontend is configured to connect to the existing Nuvrixa Supabase project.

Current frontend-safe values are stored in:

```bash
.env.example
```

The website uses Supabase for:

- Loading package data
- Submitting consultation bookings

### Deployment Ready

The project includes:

- `vercel.json`
- Vite configuration
- Environment variable template
- SPA rewrite rules
- Basic security headers

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/SumayaA-Developer/nuvrixa-website.git
cd nuvrixa-website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create local environment file

Copy the example environment file:

```bash
cp .env.example .env.local
```

Make sure the file contains:

```bash
VITE_SUPABASE_URL=https://zmverfkgmazajftkweew.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_or_anon_key
```

Only use frontend-safe Supabase keys. Never add the Supabase service-role key to frontend code.

### 4. Start the local server

```bash
npm run dev
```

The app should run at:

```bash
http://localhost:5173
```

## Supabase Configuration

This website expects these Supabase tables to exist:

- `packages`
- `consultation_bookings`
- `profiles`
- `projects`
- `project_milestones`
- `project_updates`
- `tickets`
- `ticket_replies`
- `knowledge_base_articles`

For Phase 1, the most important tables are:

### packages

Used to display Nuvrixa packages on the public website.

Expected useful columns:

- `name`
- `slug`
- `description`
- `features`
- `monthly_includes`
- `setup_price_min`
- `setup_price_max`
- `monthly_price_min`
- `monthly_price_max`
- `display_price`
- `cta_text`
- `positioning`
- `is_active`
- `sort_order`

### consultation_bookings

Used when a visitor submits the consultation form.

Expected useful columns:

- `first_name`
- `surname`
- `full_name`
- `email`
- `phone`
- `company_name`
- `business_name`
- `industry`
- `team_size`
- `service_needed`
- `package_interest`
- `current_challenges`
- `business_challenge`
- `desired_outcome`
- `preferred_date`
- `preferred_time`
- `preferred_contact_method`
- `popia_consent`
- `source`
- `status`

## Row Level Security Notes

Supabase Row Level Security should remain enabled.

Recommended Phase 1 access rules:

- Public users can read active packages.
- Public users can insert consultation bookings only when POPIA consent is accepted.
- Clients should not be able to read other clients' portal data.
- Admin users should be managed through authenticated profiles and role-based checks.

Do not disable RLS globally to make the frontend work. Add specific policies instead.

## Vercel Deployment Instructions

### 1. Import the GitHub repository

Go to Vercel and import:

```bash
SumayaA-Developer/nuvrixa-website
```

### 2. Framework preset

Choose:

```bash
Vite
```

Vercel should automatically detect:

```bash
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3. Add environment variables

In Vercel Project Settings, add:

```bash
VITE_SUPABASE_URL=https://zmverfkgmazajftkweew.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_or_anon_key
```

### 4. Deploy

Click Deploy.

After deployment, test:

- Home section loads
- Services section displays
- Packages section displays Supabase data or fallback data
- Consultation form submits successfully
- Mobile layout works

## Scripts

```bash
npm run dev
```

Runs the local development server.

```bash
npm run build
```

Builds the production application.

```bash
npm run preview
```

Previews the production build locally.

## Security Notes

- Do not commit `.env.local`.
- Do not expose Supabase service-role keys.
- Keep RLS enabled.
- Use frontend-safe publishable/anon keys only.
- Validate consultation submissions in both frontend and Supabase policies.

## Project Status

Current phase: Phase 1 public website build.

Next planned phases:

1. Authentication
2. Client portal
3. Admin portal
4. AI system layer
5. Full production hardening
