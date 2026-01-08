# Student Organization Budget App

## Overview

A mobile-first iOS application designed for college student organization treasurers to plan, track, and manage their annual budgets. The app enables real-time collaboration among e-board members, professional allocation request generation, and comprehensive financial tracking.

## Business Model

- **Target Market:** College student organizations (2,000+ colleges in US, avg 100-300 orgs per campus)
- **Pricing:** $5/month per organization (unlimited users)
- **Value Proposition:** Professional budget management at 1/3 the cost of QuickBooks
- **Revenue Potential:** 10,000 orgs = $50K MRR

## Key Features

### Core Functionality
- **Budget Planning:** Annual budget creation with income/expense tracking
- **Event Budgeting:** Individual event planning with break-even analysis
- **Real-time Collaboration:** Multiple e-board members working simultaneously
- **Expense Tracking:** Budget vs actual with variance analysis
- **Professional Reports:** PDF exports for allocation requests and year-end reports
- **Dashboard:** Visual insights with charts and health indicators

### User Management
- Organization creation and management
- Multi-user support with role-based permissions
- Real-time sync across all team members
- Activity logging

## Tech Stack

### Frontend
- **Framework:** React Native with Expo
- **Language:** TypeScript
- **UI Library:** React Native Paper (Material Design)
- **Navigation:** React Navigation
- **State Management:** Zustand or React Context
- **Charts:** Victory Native
- **PDF Export:** @react-pdf/renderer

### Backend
- **Platform:** Supabase
- **Database:** PostgreSQL
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime
- **Storage:** Supabase Storage (for exports)
- **Security:** Row Level Security (RLS)

### Payments
- **Platform:** RevenueCat
- **Payment Processor:** Apple In-App Purchases
- **Features:** Subscription management, trials, analytics

### Infrastructure
- **Hosting:** Supabase Cloud
- **App Distribution:** Apple App Store
- **Version Control:** Git/GitHub
- **CI/CD:** Expo EAS

## Project Structure

```
student-org-budget-app/
├── docs/                           # Technical documentation
│   ├── ARCHITECTURE.md            # System architecture
│   ├── DATABASE_SCHEMA.md         # Database design
│   ├── SCREEN_FLOWS.md            # UI/UX flows
│   ├── API_DOCUMENTATION.md       # API specs
│   ├── MVP_SPECIFICATIONS.md      # MVP feature list
│   └── DEVELOPMENT_ROADMAP.md     # Phased timeline
├── database/                       # Database scripts
│   ├── schema.sql                 # Table definitions
│   ├── rls_policies.sql          # Security policies
│   ├── functions.sql             # Database functions
│   └── seed_data.sql             # Sample data
├── screens/                        # Screen wireframes/specs
│   ├── authentication/
│   ├── onboarding/
│   ├── budget/
│   ├── events/
│   ├── tracking/
│   └── reports/
├── assets/                         # Design assets
└── app/                           # React Native app (Phase 2)
```

## Development Phases

### Phase 1: Technical Specification (Current)
- Architecture documentation
- Database schema design
- Screen flow mapping
- API endpoint definition
- Development roadmap

### Phase 2: MVP Development
- Core budget planning
- Basic expense tracking
- Single-user functionality
- PDF export
- Simple dashboard

### Phase 3: Full App Development
- Multi-user collaboration
- Real-time sync
- Advanced reporting
- Complete feature set
- App Store launch

## Getting Started

This repository currently contains the technical specifications. Development will begin in Phase 2.

### Prerequisites
- Node.js 18+
- Expo CLI
- Supabase account
- Apple Developer account ($99/year)
- RevenueCat account (free tier)

### Documentation

All technical specifications are in the `/docs` directory:
- Start with `ARCHITECTURE.md` for system overview
- Review `DATABASE_SCHEMA.md` for data model
- Check `SCREEN_FLOWS.md` for UX design
- See `MVP_SPECIFICATIONS.md` for initial feature set
- Follow `DEVELOPMENT_ROADMAP.md` for timeline

## Cost Analysis

### Development Costs
- **Apple Developer Program:** $99/year
- **Supabase:** Free tier → $25/month as you scale
- **RevenueCat:** Free up to $2,500/month revenue
- **Total Initial:** ~$100/year

### Break-even Analysis
- Monthly costs: ~$25 (after free tier)
- Subscription price: $5/org/month
- Break-even: 5 organizations
- Target: 100 orgs = $500/month revenue

## Market Research

### Competitors
- **QuickBooks:** $15-30/month (too complex, expensive)
- **Mint:** Free but not org-focused
- **Spreadsheets:** Free but manual, no collaboration
- **Our Advantage:** Purpose-built, affordable, collaborative

### User Personas
1. **College Treasurer** (Primary)
   - Age: 18-22
   - Tech-savvy but not finance expert
   - Needs: Simple, professional, mobile-friendly

2. **E-board Members** (Secondary)
   - Need visibility into budget
   - Want to submit expense requests
   - Collaborate on event planning

3. **Faculty Advisors** (Tertiary)
   - Review financial reports
   - Ensure responsible spending
   - Annual oversight

## Success Metrics

### MVP Launch
- 10 beta organizations
- 4+ star rating
- <2% churn rate

### 6 Months
- 100 paying organizations
- $500 MRR
- 50+ NPS score

### 12 Months
- 500 organizations
- $2,500 MRR
- Feature requests prioritized

## License

Proprietary - All rights reserved

## Contact

For questions or collaboration inquiries, please open an issue.

---

**Status:** Phase 1 - Technical Specification (In Progress)
**Last Updated:** January 8, 2026
