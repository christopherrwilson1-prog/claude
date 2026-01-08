# Development Roadmap

## Project Phases Overview

```
Phase 1: Specification ───────────► [CURRENT PHASE]
Phase 2: MVP Development ─────────► [NEXT - 8 weeks]
Phase 3: Beta Testing ────────────► [2-4 weeks]
Phase 4: Launch & Iteration ──────► [Ongoing]
```

## Phase 1: Technical Specification ✅

**Duration:** 1 week
**Status:** In Progress
**Goal:** Complete technical planning before writing code

### Deliverables
- [x] Technical architecture document
- [x] Database schema design
- [x] Screen flows and navigation
- [x] API documentation
- [x] Permissions matrix
- [x] MVP specifications
- [x] Development roadmap
- [ ] SQL schema files
- [ ] Setup and deployment guide
- [ ] Business model documentation

### Outcomes
- Clear understanding of technical requirements
- Database schema ready to implement
- Screen designs documented
- Development approach validated
- Team aligned on MVP scope

---

## Phase 2: MVP Development

**Duration:** 8 weeks
**Goal:** Build functional MVP ready for beta testing

### Week 1: Project Setup & Foundation

**Sprint Goals:**
- Initialize React Native project
- Configure Supabase backend
- Implement authentication
- Set up development environment

**Tasks:**

**Day 1-2: Project Initialization**
- [ ] Create Expo project with TypeScript
- [ ] Install core dependencies
- [ ] Configure ESLint and Prettier
- [ ] Set up folder structure
- [ ] Initialize Git repository
- [ ] Configure environment variables
- [ ] Set up Supabase project
- [ ] Configure Supabase client

**Day 3-4: Database Setup**
- [ ] Run database schema SQL
- [ ] Configure Row Level Security policies
- [ ] Create database functions
- [ ] Test database with sample data
- [ ] Set up Supabase Storage buckets

**Day 5-7: Authentication**
- [ ] Implement sign up screen
- [ ] Implement login screen
- [ ] Implement forgot password flow
- [ ] Configure auth state persistence
- [ ] Create auth context/store
- [ ] Implement protected routes
- [ ] Test authentication flows

**Deliverables:**
- ✅ Working Expo project
- ✅ Supabase configured and connected
- ✅ Authentication working end-to-end
- ✅ User profile creation on signup

---

### Week 2: Onboarding & Navigation

**Sprint Goals:**
- Complete onboarding experience
- Implement navigation structure
- Create organization setup

**Tasks:**

**Day 1-2: Navigation Setup**
- [ ] Configure React Navigation
- [ ] Create stack navigator
- [ ] Create tab navigator
- [ ] Implement navigation types
- [ ] Create screen placeholders
- [ ] Test navigation flows

**Day 3-4: Onboarding Flow**
- [ ] Design welcome screen
- [ ] Create organization creation screen
- [ ] Implement university search/dropdown
- [ ] Create organization in database
- [ ] Build onboarding tour (3 slides)
- [ ] Implement skip functionality

**Day 5-7: State Management**
- [ ] Set up Zustand stores
- [ ] Create auth store
- [ ] Create organization store
- [ ] Create user store
- [ ] Configure React Query
- [ ] Test state persistence

**Deliverables:**
- ✅ Complete onboarding flow
- ✅ Navigation working across app
- ✅ Organization creation functional
- ✅ State management configured

---

### Week 3: Budget Core Features (Part 1)

**Sprint Goals:**
- Implement budget creation
- Build budget items management
- Create dashboard

**Tasks:**

**Day 1-2: Budget Creation**
- [ ] Create budget creation screen
- [ ] Implement budget form
- [ ] Add form validation (Zod)
- [ ] Connect to Supabase API
- [ ] Test budget creation flow
- [ ] Handle error states

**Day 3-5: Budget Items**
- [ ] Design budget details screen
- [ ] Create budget item list component
- [ ] Implement add budget item modal
- [ ] Build income item form
- [ ] Build expense item form
- [ ] Add category dropdowns
- [ ] Implement semester breakdown fields

**Day 6-7: Budget Items CRUD**
- [ ] Implement edit budget item
- [ ] Implement delete budget item
- [ ] Add swipe actions
- [ ] Create confirmation dialogs
- [ ] Test all CRUD operations

**Deliverables:**
- ✅ Budget creation working
- ✅ Budget items add/edit/delete functional
- ✅ Form validation working

---

### Week 4: Budget Core Features (Part 2)

**Sprint Goals:**
- Implement calculations
- Build budget summary
- Create dashboard

**Tasks:**

**Day 1-2: Auto-Calculations**
- [ ] Implement total income calculation
- [ ] Implement total expenses calculation
- [ ] Calculate net position
- [ ] Calculate contingency (10%)
- [ ] Implement semester totals
- [ ] Test all calculations
- [ ] Add budget status logic

**Day 3-4: Budget Summary & UI**
- [ ] Create budget summary component
- [ ] Design status indicators (green/yellow/red)
- [ ] Build budget health card
- [ ] Add visual progress indicators
- [ ] Implement pull-to-refresh
- [ ] Polish UI with React Native Paper

**Day 5-7: Dashboard**
- [ ] Design dashboard screen
- [ ] Create quick stats cards
- [ ] Build budget health summary
- [ ] Add quick action buttons
- [ ] Implement navigation from dashboard
- [ ] Test dashboard data loading
- [ ] Add empty states

**Deliverables:**
- ✅ Budget calculations working automatically
- ✅ Budget summary displaying correctly
- ✅ Dashboard functional and polished

---

### Week 5: Events & Expenses

**Sprint Goals:**
- Build event management
- Implement expense tracking
- Receipt upload functionality

**Tasks:**

**Day 1-2: Event Management**
- [ ] Create event list screen
- [ ] Build create event screen
- [ ] Implement event form
- [ ] Add date picker
- [ ] Calculate expected revenue
- [ ] Display simple budget breakdown
- [ ] Test event creation

**Day 3-4: Event Details**
- [ ] Build event details screen
- [ ] Show event budget summary
- [ ] Link to related expenses
- [ ] Add edit/delete actions
- [ ] Test event CRUD operations

**Day 5-7: Expense Tracking**
- [ ] Create expense list screen
- [ ] Build add expense modal
- [ ] Implement expense form
- [ ] Add category dropdown
- [ ] Link expenses to events
- [ ] Filter by status
- [ ] Display expenses by status groups

**Deliverables:**
- ✅ Event creation and management working
- ✅ Expense tracking functional
- ✅ Events and expenses linked

---

### Week 6: Receipts & Reports

**Sprint Goals:**
- Implement receipt uploads
- Build PDF generation
- Create reports screen

**Tasks:**

**Day 1-2: Receipt Uploads**
- [ ] Integrate iOS image picker
- [ ] Implement receipt upload to Supabase Storage
- [ ] Display receipt in expense details
- [ ] Add image viewer
- [ ] Handle upload errors
- [ ] Test receipt functionality

**Day 3-5: PDF Generation**
- [ ] Set up @react-pdf/renderer
- [ ] Design budget summary PDF template
- [ ] Implement budget data formatting
- [ ] Create allocation request PDF template
- [ ] Add organization branding
- [ ] Style PDFs professionally
- [ ] Test PDF generation

**Day 6-7: Reports Screen**
- [ ] Build reports list screen
- [ ] Create PDF preview screen
- [ ] Implement iOS share sheet
- [ ] Test sharing PDFs
- [ ] Add loading states
- [ ] Handle generation errors

**Deliverables:**
- ✅ Receipt upload working
- ✅ Professional PDFs generating
- ✅ PDF sharing functional

---

### Week 7: Settings & Subscription

**Sprint Goals:**
- Build settings screens
- Implement subscription flow
- RevenueCat integration

**Tasks:**

**Day 1-2: Settings**
- [ ] Create settings screen
- [ ] Build edit profile screen
- [ ] Implement change password
- [ ] Add organization details view
- [ ] Implement logout
- [ ] Test all settings features

**Day 3-5: Subscription Setup**
- [ ] Configure RevenueCat account
- [ ] Set up iOS in-app purchase
- [ ] Integrate RevenueCat SDK
- [ ] Implement trial logic
- [ ] Create subscription screen
- [ ] Add pricing display
- [ ] Test sandbox purchases

**Day 6-7: Paywall & Trial**
- [ ] Implement trial expiration check
- [ ] Build paywall screen
- [ ] Add trial banner
- [ ] Lock features after trial
- [ ] Sync subscription status
- [ ] Test subscription flow end-to-end
- [ ] Handle subscription restoration

**Deliverables:**
- ✅ Settings functional
- ✅ Subscription flow working
- ✅ 7-day trial implemented
- ✅ Paywall enforced

---

### Week 8: Polish, Testing & Deployment

**Sprint Goals:**
- Fix bugs
- Polish UI/UX
- Prepare for TestFlight
- Deploy beta

**Tasks:**

**Day 1-2: Bug Fixes**
- [ ] Review all features
- [ ] Fix critical bugs
- [ ] Fix UI issues
- [ ] Test edge cases
- [ ] Improve error messages
- [ ] Add loading states everywhere

**Day 3-4: UI Polish**
- [ ] Consistent spacing and typography
- [ ] Smooth transitions
- [ ] Better empty states
- [ ] Improved form UX
- [ ] Accessibility improvements
- [ ] Dark mode support (if time)

**Day 5: Testing**
- [ ] Full app walkthrough
- [ ] Test all user flows
- [ ] Test on multiple iOS versions
- [ ] Test on different screen sizes
- [ ] Performance testing
- [ ] Memory leak checks

**Day 6-7: Deployment**
- [ ] Configure EAS Build
- [ ] Create iOS build
- [ ] Set up TestFlight
- [ ] Upload build to TestFlight
- [ ] Add beta testers
- [ ] Create release notes
- [ ] Deploy to TestFlight
- [ ] Send invites to beta testers

**Deliverables:**
- ✅ All critical bugs fixed
- ✅ Polished UI
- ✅ App on TestFlight
- ✅ Beta testers invited

---

## Phase 3: Beta Testing

**Duration:** 2-4 weeks
**Goal:** Gather feedback and validate product-market fit

### Week 1-2: Closed Beta

**Objectives:**
- Test with 5-10 close contacts
- Identify critical bugs
- Validate core workflows
- Gather initial feedback

**Tasks:**
- [ ] Recruit 5-10 beta testers (friends, student orgs)
- [ ] Send onboarding instructions
- [ ] Monitor TestFlight crashes
- [ ] Collect feedback via form
- [ ] Weekly check-ins with testers
- [ ] Fix critical bugs
- [ ] Deploy bug fix builds

**Success Criteria:**
- 80%+ complete onboarding
- 60%+ create a budget
- No critical bugs reported
- 4+/5 average rating

### Week 3-4: Open Beta

**Objectives:**
- Expand to 20-50 users
- Test at scale
- Refine based on feedback
- Prepare for App Store

**Tasks:**
- [ ] Recruit 20-50 beta testers
- [ ] Monitor usage analytics
- [ ] Collect detailed feedback
- [ ] Prioritize feature requests
- [ ] Fix remaining bugs
- [ ] Improve onboarding based on data
- [ ] Optimize performance
- [ ] Update screenshots and marketing

**Success Criteria:**
- 50 active users
- 20%+ trial-to-paid conversion
- 4.5+/5 average rating
- Zero critical bugs

---

## Phase 4: App Store Launch

**Duration:** Week 1-2
**Goal:** Launch on App Store publicly

### Pre-Launch Checklist

**App Store Assets:**
- [ ] App icon (1024x1024)
- [ ] Screenshots (6.7", 6.5", 5.5")
- [ ] App preview video (optional)
- [ ] App description
- [ ] Keywords
- [ ] Support URL
- [ ] Marketing URL
- [ ] Privacy policy URL
- [ ] Terms of service URL

**Legal & Compliance:**
- [ ] Privacy policy finalized
- [ ] Terms of service finalized
- [ ] Data collection disclosure
- [ ] COPPA compliance (if needed)
- [ ] Apple Developer Agreement signed

**Technical:**
- [ ] Production build created
- [ ] All features working
- [ ] Subscription fully tested
- [ ] Analytics configured
- [ ] Crash reporting enabled
- [ ] App Store Connect configured

### Launch Week

**Day 1-2:**
- [ ] Submit to App Store
- [ ] Respond to any Apple feedback
- [ ] Make required changes

**Day 3-5:**
- [ ] App Review (typically 24-48 hours)
- [ ] Address any rejections
- [ ] Resubmit if needed

**Day 6-7:**
- [ ] App approved
- [ ] Release to App Store
- [ ] Announce launch
- [ ] Monitor reviews and ratings

---

## Phase 5: Post-Launch Iteration

**Ongoing**
**Goal:** Iterate based on user feedback and grow user base

### Month 1 (Post-Launch)

**Focus:** Stability & User Acquisition

**Tasks:**
- [ ] Monitor crash reports daily
- [ ] Respond to user reviews
- [ ] Fix critical bugs within 24 hours
- [ ] Release hot fixes as needed
- [ ] Track key metrics (DAU, MAU, conversion)
- [ ] Begin user interviews
- [ ] Plan v1.1 features

**Metrics to Track:**
- Downloads per day
- Activation rate (complete onboarding)
- Trial starts
- Trial-to-paid conversion
- Churn rate
- DAU/MAU
- Revenue
- App Store rating

### Month 2-3: Version 1.1

**Focus:** Team Collaboration

**New Features:**
- [ ] Team invitations
- [ ] Multi-user support
- [ ] Role-based permissions
- [ ] Activity log
- [ ] Improved reports

**Timeline:**
- Week 1-2: Development
- Week 3: Testing
- Week 4: Release

### Month 4-6: Version 1.2

**Focus:** Advanced Features

**New Features:**
- [ ] Real-time collaboration
- [ ] Expense approval workflows
- [ ] Push notifications
- [ ] Charts and analytics
- [ ] Budget templates

**Timeline:**
- Week 1-4: Development
- Week 5-6: Testing
- Week 7-8: Release

### Month 6-12: Version 2.0

**Focus:** Scale & Polish

**New Features:**
- [ ] Multiple organizations per user
- [ ] Organization switching
- [ ] Advanced reporting
- [ ] Export to Excel
- [ ] Year-over-year comparison
- [ ] Budget forecasting
- [ ] Integration with QuickBooks (if viable)
- [ ] Android version

---

## Development Best Practices

### Git Workflow

**Branches:**
```
main (production)
  ↑
develop (staging)
  ↑
feature/feature-name
```

**Commit Messages:**
```
feat: Add budget item creation
fix: Fix calculation rounding error
docs: Update API documentation
refactor: Simplify budget calculations
test: Add budget item tests
```

### Code Review Process

**Before Merging:**
- [ ] All tests pass
- [ ] No console errors
- [ ] Code follows style guide
- [ ] Peer review completed
- [ ] Tested on device
- [ ] No performance regressions

### Testing Strategy

**Unit Tests:**
- Utility functions
- Calculations
- Data transformations

**Integration Tests:**
- API calls
- Database operations
- State management

**E2E Tests (Post-MVP):**
- Critical user flows
- Subscription flow
- Budget creation flow

### Release Process

**Every 2 Weeks:**
1. Create release branch from develop
2. Increment version number
3. Create build with EAS
4. Upload to TestFlight
5. Internal QA testing
6. Release to beta testers
7. Collect feedback
8. Fix bugs in release branch
9. Merge to main
10. Tag release
11. Deploy to App Store (if stable)

---

## Risk Management

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Supabase downtime | High | Low | Implement caching, retry logic |
| RevenueCat issues | High | Low | Test thoroughly, have support plan |
| App Store rejection | Medium | Medium | Follow guidelines strictly, pre-review |
| Performance issues | Medium | Medium | Profile early, optimize proactively |
| Database migration errors | High | Low | Test migrations in dev first |

### Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low user adoption | High | Medium | Validate with beta, iterate quickly |
| Poor trial conversion | High | Medium | Optimize onboarding, prove value fast |
| High churn | Medium | Medium | Gather feedback, improve features |
| Competitor launches | Medium | Low | Focus on student orgs specifically |
| Pricing too high/low | Medium | Medium | Test pricing, survey users |

### Contingency Plans

**If Trial Conversion < 20%:**
- Extend trial to 14 days
- Add more value in trial period
- Improve onboarding
- Survey non-converters

**If Technical Challenges Delay MVP:**
- Cut scope further (remove events/expenses temporarily)
- Focus on budget management only
- Launch with even simpler MVP

**If Apple Rejects App:**
- Address feedback immediately
- Have legal review ready
- Be prepared to adjust features

---

## Success Metrics by Phase

### Phase 2 (MVP Development)
- ✅ All MVP features built
- ✅ Zero critical bugs
- ✅ App loads in < 2 seconds
- ✅ All tests passing

### Phase 3 (Beta)
- 🎯 50 beta users
- 🎯 4+/5 average rating
- 🎯 60%+ create budget
- 🎯 20%+ trial conversion

### Phase 4 (Launch)
- 🎯 App approved by Apple
- 🎯 100 downloads week 1
- 🎯 4.5+ App Store rating
- 🎯 $250 MRR month 1

### Phase 5 (Growth - 6 months)
- 🎯 500 total users
- 🎯 100 paying customers
- 🎯 $500 MRR
- 🎯 <5% monthly churn
- 🎯 50+ NPS score

---

## Resource Requirements

### Development Team (MVP)
- **1 Full-stack Developer** - React Native + Supabase
- **Time:** 8 weeks full-time (or 16 weeks part-time)

### Design (MVP)
- **UI/UX:** React Native Paper components (minimal custom design)
- **Assets:** App icon, screenshots
- **Time:** 1-2 weeks

### Tools & Services
- **Apple Developer:** $99/year
- **Supabase:** Free tier → $25/month
- **RevenueCat:** Free tier
- **Expo EAS:** Free tier → $29/month if needed
- **Total:** ~$150-200/month at scale

---

**Last Updated:** January 8, 2026
**Version:** 1.0
**Status:** Specification Phase
