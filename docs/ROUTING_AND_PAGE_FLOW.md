# Lucid Application - Routing & Page Flow Documentation

**Last Updated:** May 9, 2026

---

## Table of Contents
1. [Route Map](#route-map)
2. [Main User Journeys](#main-user-journeys)
3. [Dashboard Role-Based Routing](#dashboard-role-based-routing)
4. [Key Flow Insights](#key-flow-insights)
5. [Authentication Gates](#authentication-gates)

---

## Route Map

### Public Routes (No authentication required)

| Path | Component | Purpose |
|------|-----------|---------|
| `/lucid/` | Home | Landing page |
| `/lucid/signup` | Signup | User registration |
| `/lucid/signin` | Signin | User login |
| `/lucid/about` | About | About page |
| `/lucid/help` | HelpSupport | Help & support page |
| `/lucid/become-provider` | Signup | Provider registration (redirects to signup) |
| `/lucid/search` | Service | Search/browse services |
| `/lucid/services` | Service | Services listing |
| `/lucid/services/:category` | Category | Services by category (dynamic) |
| `/lucid/services/:category/:service` | Selected_service | Individual service details (dynamic) |
| `/lucid/providers/:id` | GeneralProfile | Provider profile view (dynamic) |

### Protected Routes (Authenticated users only)

| Path | Component | Purpose |
|------|-----------|---------|
| `/lucid/dashboard` | DashboardPage | Main dashboard (role-based redirect) |
| `/lucid/account` | AccountPage | Account management |
| `/lucid/account/profile` | UserProfile | View user profile |
| `/lucid/account/profile/edit` | EditProfile | Edit user profile |
| `/lucid/bookings` | BookingsPage | View bookings |
| `/lucid/bookings/new` | BookingRequest | Create new booking |
| `/lucid/bookings/confirmation` | BookingConfirmation | Booking confirmation page |
| `/lucid/bookings/history` | BookingHistoryPage | Booking history |
| `/lucid/messages` | MessagesListPage | Messaging inbox |
| `/lucid/messages/:id` | ChatMessagingPage | Individual chat (dynamic) |
| `/lucid/notifications` | NotificationsPage | Notifications page |
| `/lucid/notifications/settings` | NotificationSettings | Notification preferences |

### Protected Routes - Service Providers Only

| Path | Component | Purpose |
|------|-----------|---------|
| `/lucid/earnings` | EarningsPayments | Earnings & payment management |

### Catch-all Route

| Path | Behavior |
|------|----------|
| `/*` | Redirects to `/lucid/` |

---

## Main User Journeys

### 1. AUTHENTICATION FLOW

```
┌─ Home (/lucid/)
│  │
│  ├─→ Sign Up (/lucid/signup) → Create Account
│  │     ↓
│  ├─→ Sign In (/lucid/signin) → Login
│  │     ↓
│  └─→ Dashboard Redirect (/lucid/dashboard)
│       ├─ Client → Client Dashboard
│       └─ Provider → Provider Dashboard
```

---

### 2. CLIENT BOOKING FLOW (Search → Book → Pay)

```
┌─ Home (/lucid/)
│  ↓
├─ Services (/lucid/services) — Browse all services
│  ├─ Category Page (/lucid/services/:category) — Filter by category
│  │  ├─ Moving, Cleaning, Repair, etc.
│  │  ↓
│  └─ Service Details (/lucid/services/:category/:service)
│     ├─ View service overview
│     ├─ See available providers
│     ↓
│  Provider Profile (/lucid/providers/:id)
│  ├─ View provider details, ratings, reviews
│  ├─ Check availability
│  ↓
Booking Request (/lucid/bookings/new) — 4-Step Form
│  ├─ Step 1: Select service type & description
│  ├─ Step 2: Set date, time & urgency
│  ├─ Step 3: Add location details
│  ├─ Step 4: Upload images, confirm budget
│  ↓
Booking Confirmation (/lucid/bookings/confirmation)
│  ├─ Review booking details
│  ├─ Confirm & pay
│  ↓
Bookings (/lucid/bookings) — Track active bookings
│  ├─ View status (pending, confirmed, in-progress, completed)
│  ├─ Access booking details modal
│  ├─ Cancel or complete booking
│  ↓
Booking History (/lucid/bookings/history)
│  ├─ View past bookings
│  ├─ Leave reviews & ratings
│  └─ Download receipts
```

---

### 3. PROVIDER WORKFLOW (Accept → Manage → Complete → Earn)

```
Provider Dashboard (/lucid/dashboard)
│  ├─ View incoming booking requests
│  ├─ See active tasks
│  ├─ Quick stats (earnings, ratings, tasks)
│  ↓
Provider Tasks (/lucid/provider_tasks) — OR Bookings Tab
│  ├─ Pending requests → Accept/Decline
│  ├─ Active tasks → Update status
│  ├─ Completed tasks → Request review
│  ↓
Task Management (/lucid/provider_tasks)
│  ├─ Mark as in-progress
│  ├─ Update status to completed
│  ├─ Request client confirmation
│  ↓
Earnings (/lucid/earnings)
│  ├─ View income breakdown
│  ├─ See pending/completed payments
│  ├─ Withdraw earnings
│  ├─ View transaction history
```

---

### 4. BOOKING LIFECYCLE FLOW (Internal)

```
Booking Created
   ↓ (Provider can see in notifications)
Provider Accepts/Declines
   ↓
Booking Confirmed
   ├─ Client payment processed
   ├─ Provider notified of confirmation
   ↓
Task In Progress
   ├─ Provider updates status
   ├─ Client can see real-time updates
   ↓
Task Completed
   ├─ Provider marks as done
   ├─ Client confirms completion
   ↓
Payment Released
   ├─ Amount transferred to provider
   ├─ Receipt generated
   ↓
Review & Rating
   ├─ Client leaves review
   ├─ Provider sees feedback
   └─ Booking archived
```

---

### 5. PROFILE & ACCOUNT FLOW

```
Account (/lucid/account) — Hub page
│  ├─ Shows role-based options
│  │  ├─ Client → View client info
│  │  └─ Provider → View provider info
│  ↓
User Profile (/lucid/account/profile)
│  ├─ View profile info
│  ├─ See profile photo, bio, skills
│  ↓
Edit Profile (/lucid/account/profile/edit)
│  ├─ Update personal info
│  ├─ Change profile photo
│  ├─ Update skills/services (providers)
│  ├─ Save changes
│  ↓
Account Settings (/lucid/account) — Settings tab
│  ├─ Update password
│  ├─ Enable/disable account
│  ├─ Delete account
```

---

### 6. MESSAGING FLOW

```
Messages (/lucid/messages)
│  ├─ View all conversations
│  ├─ See unread counts
│  ├─ Search conversations
│  ↓
Chat (/lucid/messages/:id)
│  ├─ View message thread with specific user
│  ├─ Send new messages
│  ├─ View booking context
│  ├─ Can attach files/images
│  ↓
Back to Messages
```

---

### 7. NOTIFICATIONS FLOW

```
Notifications (/lucid/notifications)
│  ├─ View all notifications
│  ├─ Notification types:
│  │  ├─ Booking updates
│  │  ├─ Messages
│  │  ├─ Reviews received
│  │  └─ Payment updates
│  ↓
Notification Settings (/lucid/notifications/settings)
│  ├─ Toggle notification types
│  ├─ Email preferences
│  ├─ SMS preferences
```

---

### 8. SEARCH & DISCOVERY FLOW

```
Home (/lucid/)
│  ├─ Featured services carousel
│  ├─ Category icons (8 main categories)
│  ↓
Services (/lucid/services)
│  ├─ Search bar for services
│  ├─ Filter by category
│  ├─ Sort by rating/price/distance
│  ↓
Category (/lucid/services/:category)
│  ├─ View all providers in category
│  ├─ Filter & sort options
│  ├─ See ratings & reviews
│  ↓
Provider Profile (/lucid/providers/:id)
   └─ Click "Book Now" → Booking Flow
```

---

### 9. ADMIN/UTILITY FLOWS

```
About (/lucid/about)
│  └─ Company info, mission, team

Help & Support (/lucid/help)
│  ├─ FAQ section
│  ├─ Common issues
│  ├─ Contact support
```

---

## Dashboard Role-Based Routing

```
/lucid/dashboard (Protected)
│
├─ Service Provider Role
│  ├─ Provider Dashboard (/lucid/dashboard)
│  │  ├─ Quick stats (earnings, tasks, rating)
│  │  ├─ Recent bookings
│  │  ├─ Upcoming tasks
│  │  └─ Link to Earnings
│  │
│  └─ Earnings (/lucid/earnings) — Provider only
│     ├─ Income breakdown
│     ├─ Payment history
│     └─ Withdrawal options
│
└─ Client Role
   ├─ Client Dashboard (/lucid/dashboard)
   │  ├─ Active bookings summary
   │  ├─ Upcoming tasks
   │  ├─ Recent reviews given
   │  ├─ Recommended services
   │  └─ Link to Browse Services
```

---

## Key Flow Insights

| Aspect | Client Flow | Provider Flow |
|--------|-------------|---------------|
| **Primary Action** | Browse → Book → Pay | Accept → Execute → Earn |
| **Key Pages** | Services, Bookings, Profile | Dashboard, Tasks, Earnings |
| **Notifications** | Booking updates, Messages | Booking requests, Payments |
| **Review Path** | After completion, leave review | Receives rating, reply to review |
| **Payment** | Pay upfront at confirmation | Receive after completion |

---

## Authentication Gates

### Public Access
- Home
- Signup
- Signin
- Services
- Providers
- About
- Help

### Protected Access (Authenticated Users)
- Dashboard
- Account
- Bookings
- Messages
- Notifications

### Provider-Only Access
- Earnings page

### Layout Behavior
**Navbar & Footer Hidden** on these routes:
- Account pages (`/lucid/account*`)
- Dashboard (`/lucid/dashboard`)
- Bookings (`/lucid/bookings*`)
- Notifications (`/lucid/notifications*`)
- Earnings (`/lucid/earnings`)
- Messaging (`/lucid/messages*`)

---

## Technical Implementation

### Authentication
- Uses Supabase session management
- `ProtectedRoute` wrapper enforces authentication
- Redirects unauthenticated users to `/lucid/signin`
- Role-based access control for provider-only routes

### Base URL
All routes are prefixed with `/lucid/` for deployment flexibility

### Navigation Structure
- All routes use React Router v6
- Dynamic parameters supported (`:category`, `:service`, `:id`, `:providerId`)
- Catch-all route redirects to home

---

## User Journey Summary

This creates a complete user experience:

**For Clients:**
Discovery → Browsing → Selection → Booking → Payment → Completion → Review → Earnings Visibility

**For Providers:**
Registration → Profile Setup → Notification → Acceptance → Execution → Completion → Payment → Earnings Management

**Both Roles:**
Account Management → Profile Customization → Messaging → Notifications → History Tracking
