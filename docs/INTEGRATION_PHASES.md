# Lucid — Integration Phases

Copy files in the order below. Each phase lists exactly what to copy and what must already exist before it works. Your buddy has already handled **Auth** and **Navbar/Footer**, so start from Phase 2.

---

## Already Done (your buddy's work)
- `src/lib/supabaseClient.js`
- `src/pages/sign_in.jsx`
- `src/pages/sign_up.jsx`
- `src/components/navbar.jsx`
- `src/components/footer.jsx`
- `src/pages/home.jsx`
- `src/pages/home_sections.jsx`

---

## Phase 1 — Foundation (copy this before anything else)

Everything in the app depends on these. They have no local imports of their own.

### Contexts
```
src/contexts/NotificationContext.jsx
```
- Wraps the entire app in `App.jsx`
- Exposes `useNotification()` — used by almost every page and the navbar

### Hooks
```
src/hooks/useRole.js               ← reads Supabase session to return 'client' | 'service_provider'
src/hooks/useNavigateBack.js       ← back-button helper used across all dashboard pages
src/hooks/useImageUpload.js        ← modal open/close state for image uploads
src/hooks/useProviderProfile.js    ← fetches a provider row from Supabase profiles table
```

### UI Primitives (`src/components/ui/`)
These are the lowest-level building blocks — no local imports.
```
src/components/ui/Button.jsx
src/components/ui/Input.jsx
src/components/ui/Avatar.jsx
src/components/ui/Card.jsx
src/components/ui/Modal.jsx
src/components/ui/StatCard.jsx
src/components/ui/StatusBadge.jsx
src/components/ui/NotificationBadge.jsx
src/components/ui/PageHeader.jsx
src/components/ui/FilterBar.jsx
src/components/ui/EmptyState.jsx
src/components/ui/index.js          ← barrel export, import everything from here
```

### Shared Components (`src/components/shared/`)
Reusable modals and cards used across multiple flows.
```
src/components/shared/ImageUploadModal.jsx
src/components/shared/ReviewThread.jsx
src/components/shared/ProfileCard.jsx
src/components/shared/BookingCard.jsx       ← needs ui/Avatar, ui/StatusBadge
src/components/shared/CancelBookingModal.jsx← needs ui/Button
src/components/shared/ReviewModal.jsx
src/components/shared/PaymentModals.jsx
src/components/shared/BookingDetailsModal.jsx← needs ReviewModal, PaymentModals
src/components/shared/ReceiptModal.jsx
src/components/shared/index.js              ← barrel export
```

### General-use Components
```
src/components/Breadcrumb.jsx
src/components/back_the_top_btn.jsx
src/components/back_to_bottom_btn.jsx
src/components/project_Carousel.jsx
```

---

## Phase 2 — Services Discovery Flow

**What it does:** Public-facing browsing. User goes Services → All Categories → Category page → Selected Service page → Provider profile.

**Needs Phase 1 before it works.**

### Data
```
src/data/categories.js       ← single source of truth for all 10 categories + sub-services
                                exports: ALL_CATEGORIES, getCategoryBySlug(), getServiceBySlug()
```

### Components (only used in this flow)
```
src/components/servicePage_carousel.jsx   ← used only in Services.jsx
src/components/suggested_category.jsx    ← used in Services.jsx + selected_service.jsx
src/components/download_ad.jsx           ← used in category.jsx + selected_service.jsx
```

### Pages (copy in this order)
```
src/pages/Services.jsx           → route: /lucid/services  and  /lucid/search
src/pages/AllCategories.jsx      → route: /lucid/services/all
src/pages/category.jsx           → route: /lucid/services/:category
src/pages/selected_service.jsx   → route: /lucid/services/:category/:service
```

> **Route order matters in App.jsx:**
> `/lucid/services/all` MUST be declared before `/lucid/services/:category`
> or "all" gets treated as a category slug.

### How these pages connect
```
Services.jsx
  ├─ links to → /lucid/services/all       (AllCategories.jsx)
  └─ links to → /lucid/services/:category  (category.jsx)

AllCategories.jsx
  └─ links to → /lucid/services/:category  (category.jsx)

category.jsx
  └─ links to → /lucid/services/:category/:service  (selected_service.jsx)

selected_service.jsx
  └─ links to → /lucid/providers/:id       (general_profilePage.jsx — Phase 3)
```

---

## Phase 3 — Provider Profile Flow

**What it does:** Public provider profile (seen by clients), the provider's own profile view, and the edit page.

**Needs Phase 1 + Phase 2 (selected_service links here).**

### Data
```
src/data/mockProvider.js      ← shared mock data for both profile pages
                                 exports: MOCK_PROVIDER, PAYMENT_LABELS, formatTime()
src/data/mockProfiles.js      ← mock provider list used by selected_service.jsx
                                 exports: mockProviders, getProvidersBySkill(),
                                          getProvidersByArea(), getTopRatedProviders(),
                                          getAvailableProviders()
```

### Pages (copy in this order)
```
src/pages/general_profilePage.jsx  → route: /lucid/providers/:id
                                      (public — what a client sees when viewing a provider)

src/pages/user_Profile.jsx         → route: /lucid/account/profile
                                      (private — what the provider sees of their own profile)

src/pages/edit.jsx                 → route: /lucid/account/profile/edit
                                      (private — provider edits their profile)
```

### How these pages connect
```
selected_service.jsx
  └─ links to → /lucid/providers/:id     (general_profilePage.jsx)

general_profilePage.jsx
  └─ (client views provider, no edit controls)

user_Profile.jsx
  ├─ "Edit Profile" button → /lucid/account/profile/edit   (edit.jsx)
  └─ "View My Bookings"   → /lucid/bookings                (Phase 4)

edit.jsx
  └─ on save → /lucid/dashboard                            (Phase 5)
```

> `general_profilePage.jsx` and `user_Profile.jsx` both import from
> `src/data/mockProvider.js`. When your buddy wires real data, only
> that one file needs changing — both pages update automatically.

---

## Phase 4 — Bookings Flow

**What it does:** Clients request bookings, both sides view/manage active bookings and history.

**Needs Phase 1 + Phase 3.**

### Data
```
src/data/mockData.js          ← central mock data hub
                                 exports: CURRENT_PROVIDER_ID, CURRENT_CLIENT_ID,
                                          MOCK_PROVIDERS, MOCK_CLIENTS, MASTER_BOOKINGS,
                                          getBookingsByClient(), getBookingsByProvider(),
                                          getBookingById(), calculateBookingStats(),
                                          useClientBookings(), useProviderBookings()

src/data/mockBookings.js      ← re-exports from mockData.js (legacy stub)
src/data/mockCurrentUser.js   ← re-exports CURRENT_CLIENT_ID, CURRENT_PROVIDER_ID
src/data/mockDataUtils.js     ← re-exports booking query functions + filterBookingsByPeriod()
src/data/mockProfiles.js      ← (already copied in Phase 3)
```

### Pages (copy in this order)
```
src/pages/booking_request.jsx      → route: /lucid/bookings/new
src/pages/booking_confirmation.jsx → route: /lucid/bookings/confirmation

src/pages/client_bookings.jsx      → used inside BookingsPage when role = client
src/pages/provider_bookings.jsx    → used inside BookingsPage when role = service_provider
src/pages/BookingsPage.jsx         → route: /lucid/bookings  (role-switcher wrapper)

src/pages/client_history.jsx       → used inside BookingHistoryPage when role = client
src/pages/provider_history.jsx     → used inside BookingHistoryPage when role = service_provider
src/pages/BookingHistoryPage.jsx   → route: /lucid/bookings/history  (role-switcher wrapper)
```

### How these pages connect
```
BookingsPage.jsx
  ├─ role=client   → client_bookings.jsx
  └─ role=provider → provider_bookings.jsx

Both bookings pages use:
  BookingCard → BookingDetailsModal → ReviewModal + PaymentModals
                                   └─ CancelBookingModal

BookingHistoryPage.jsx
  ├─ role=client   → client_history.jsx
  └─ role=provider → provider_history.jsx

booking_request.jsx → /lucid/bookings/confirmation → BookingConfirmation.jsx
```

> `BookingsPage.jsx`, `BookingHistoryPage.jsx` are thin wrappers that just
> call `useRole()` and render the right child. Copy the child pages first.

---

## Phase 5 — Dashboard Flow

**What it does:** Post-login landing page. Shows stats, recent bookings, map, earnings preview.

**Needs Phase 1 + Phase 4 (uses booking data and booking modals).**

### Components (only used in dashboard/earnings)
```
src/components/ServicesMap.jsx        ← map component in client dashboard
src/components/earningsDashboard.jsx  ← earnings summary in provider dashboard
src/components/earnings_chart.jsx     ← chart used in provider dashboard + earnings page
```

### Pages (copy in this order)
```
src/pages/client_dashboard.jsx     → used inside DashboardPage when role = client
src/pages/provider_dashboard.jsx   → used inside DashboardPage when role = service_provider
src/pages/DashboardPage.jsx        → route: /lucid/dashboard  (role-switcher wrapper)

src/pages/earnings.jsx             → route: /lucid/earnings  (provider only)
```

### How these pages connect
```
DashboardPage.jsx
  ├─ role=client   → client_dashboard.jsx
  │    uses: ServicesMap, StatCard, BookingDetailsModal, CancelBookingModal
  └─ role=provider → provider_dashboard.jsx
       uses: earningsDashboard, earnings_chart, StatCard, BookingDetailsModal

earnings.jsx
  └─ uses: earnings_chart
```

---

## Phase 6 — Account & Settings Flow

**What it does:** User account management — profile overview, account settings (name/email/phone), notification preferences.

**Needs Phase 1 + Phase 3 (profile pages) + Phase 4 (booking stats on overview).**

### Pages (copy in this order)
```
src/pages/accountsettings.jsx          → route: /lucid/account/settings

src/pages/client_account_overview.jsx  → used inside AccountPage when role = client
src/pages/provider_account_overview.jsx→ used inside AccountPage when role = service_provider
src/pages/AccountPage.jsx              → route: /lucid/account  (role-switcher wrapper)

src/pages/notification_page.jsx        → route: /lucid/notifications
src/pages/notificationSettings.jsx     → route: /lucid/notifications/settings
```

### How these pages connect
```
AccountPage.jsx
  ├─ role=client   → client_account_overview.jsx
  └─ role=provider → provider_account_overview.jsx

provider_account_overview.jsx navigation items:
  ├─ Account Settings → /lucid/account/settings   (accountsettings.jsx)
  ├─ My Tasks         → /lucid/bookings            (Phase 4)
  ├─ Earnings         → /lucid/earnings            (Phase 5)
  ├─ History          → /lucid/bookings/history    (Phase 4)
  ├─ Notifications    → /lucid/notifications/settings
  └─ Help & Support   → /lucid/help               (Phase 8)

notification_page.jsx
  └─ links to → /lucid/notifications/settings  (notificationSettings.jsx)
```

---

## Phase 7 — Messaging Flow

**What it does:** Real-time chat between clients and providers.

**Needs Phase 1 only.**

### Pages
```
src/pages/messagelist.jsx    → route: /lucid/messages
src/pages/messaging.jsx      → route: /lucid/messages/:id
```

### How these pages connect
```
messagelist.jsx
  └─ click conversation → /lucid/messages/:id  (messaging.jsx)
```

> These two pages are self-contained. messaging.jsx uses `back_to_bottom_btn`
> (already in Phase 1) and messagelist.jsx uses `ui/NotificationBadge` (Phase 1).

---

## Phase 8 — Static / Misc Pages

**What it does:** Informational pages with no dependencies on other pages.

**Needs Phase 1 only.**

```
src/pages/about.jsx          → route: /lucid/about
src/pages/help_support.jsx   → route: /lucid/help
```

---

## App.jsx — Final Wiring

Copy `App.jsx` last (or add routes incrementally as each phase is done).
The route order that matters:

```jsx
// Services — /all before /:category or "all" matches as a category slug
<Route path="/lucid/services/all"              element={<AllCategories />} />
<Route path="/lucid/services/:category"        element={<Category />} />
<Route path="/lucid/services/:category/:service" element={<SelectedService />} />

// Role-switching wrappers — copy child pages before the wrapper
<Route path="/lucid/dashboard"       element={<DashboardPage />} />
<Route path="/lucid/account"         element={<AccountPage />} />
<Route path="/lucid/bookings"        element={<BookingsPage />} />
<Route path="/lucid/bookings/history" element={<BookingHistoryPage />} />
```

---

## Dependency Summary Table

| Phase | Pages | Needs |
|---|---|---|
| 1 — Foundation | UI primitives, shared components, hooks, context | Nothing (copy first) |
| 2 — Services | Services, AllCategories, Category, SelectedService | Phase 1 |
| 3 — Provider Profile | GeneralProfile, UserProfile, EditProfile | Phase 1, 2 |
| 4 — Bookings | BookingsPage, History, Request, Confirmation | Phase 1, 3 |
| 5 — Dashboard | DashboardPage, Earnings | Phase 1, 4 |
| 6 — Account | AccountPage, AccountSettings, Notifications | Phase 1, 3, 4 |
| 7 — Messaging | MessageList, Messaging | Phase 1 |
| 8 — Static | About, Help | Phase 1 |

---

## Files Your Buddy Can Replace with Real API Calls

When switching from mock to real backend, these are the only files that need to change — all pages just consume from them:

| File | What it provides | Replace with |
|---|---|---|
| `src/data/mockProvider.js` | MOCK_PROVIDER object | `useProviderProfile` hook result |
| `src/data/mockData.js` | All booking data + query functions | Real API hooks (React Query / SWR) |
| `src/data/mockProfiles.js` | Provider list for service pages | GET /providers endpoint |
| `src/hooks/useProviderProfile.js` | Already calls Supabase — just enable it | Already wired |
| `src/hooks/useRole.js` | Already calls Supabase — just enable it | Already wired |
