# Lucid — UI & Architecture Audit

## Summary

The project has a solid foundation: 28 routes, a component library (`ui/`), shared booking modals, comprehensive mock data, and a Tailwind + DaisyUI theme. The gaps are **pattern duplication** (the same card/header/badge layouts copy-pasted across pages), **inconsistent primitive usage** (raw `<input>` vs `<Input>` component, hardcoded colors vs theme tokens), and **mock data that doesn't cover the full booking workflow end-to-end**.

---

## 1. File Structure Assessment

**Status: Good — minor reorganisation needed**

```
src/
  components/
    ui/           ✅ Button, Input, Modal, Card, Avatar, NotificationBadge
    shared/       ✅ BookingDetailsModal, CancelBookingModal, ReviewModal,
                     PaymentModals, ReceiptModal, ProfileCard, ReviewThread,
                     ImageUploadModal
    (root)        ⚠️  navbar, footer, carousels, earnings, map — no sub-grouping
  pages/          ✅ 28 pages, logically named
  data/           ✅ mockBookings, mockDataUtils, mockProfiles, providerDataUtils
  hooks/          ✅ useNavigateBack, useImageUpload
  context/        ✅ NotificationContext
  constants/      ✅ index.js
  theme.js        ✅ color/spacing/shadow tokens
```

### Steps

- [ ] Move carousels into `components/carousels/`
- [ ] Move `earnings_chart.jsx`, `earningsDashboard.jsx` into `components/earnings/`
- [ ] Move `ServicesMap`, `download_ad.jsx`, `SuggestedCategory` into `components/marketing/`
- [ ] Move `back_to_bottom_btn`, `back_the_top_btn` into `components/ui/`
- [ ] Rename files to consistent `camelCase` or `PascalCase` (currently mixed: `navbar.jsx`, `Services.jsx`, `sign_up.jsx`)

---

## 2. Missing Reusable Components

These patterns appear in **2+ pages** as copy-pasted inline code and must become shared components.

### 2a. `StatusBadge` — `components/ui/StatusBadge.jsx`

Used everywhere a booking status or urgency is displayed.

| Current state | Target |
|---|---|
| Inline Tailwind classes repeated per page | Single component with `status` prop |

```jsx
// Usage
<StatusBadge status="confirmed" />
<StatusBadge status="pending" />
<StatusBadge urgency="urgent" />
```

Appears in: `client_bookings`, `provider_bookings`, `client_history`, `provider_history`, `client_dashboard`, `provider_dashboard`, `BookingDetailsModal`

- [ ] Create `StatusBadge` with variants: `pending | confirmed | in-progress | completed | cancelled`
- [ ] Add urgency variant: `normal | urgent | emergency`
- [ ] Replace all inline status badge code with `<StatusBadge>`

---

### 2b. `PageHeader` — `components/ui/PageHeader.jsx`

Every dashboard/list page has an identical back-button + title + subtitle pattern.

```jsx
// Usage
<PageHeader
  title="My Bookings"
  subtitle="Track and manage your service requests"
  backTo="/client_dashboard"
/>
```

Appears in: `client_bookings`, `provider_bookings`, `client_history`, `provider_history`, `earnings`, `notification_page`, `messagelist`, `help_support`

- [ ] Create `PageHeader` component
- [ ] Replace inline headers in all 8 pages

---

### 2c. `StatCard` — `components/ui/StatCard.jsx`

Stat cards (icon + label + value + optional trend) are inline in dashboards and earnings.

```jsx
// Usage
<StatCard
  icon={<Briefcase />}
  label="Total Bookings"
  value={42}
  trend="+12%"
  trendUp
/>
```

Appears in: `client_dashboard`, `provider_dashboard`, `earnings`

- [ ] Create `StatCard` component
- [ ] Replace inline stat cards in 3 pages

---

### 2d. `BookingCard` — `components/shared/BookingCard.jsx`

The booking list card (provider/client info, status, date, location, price, action buttons) is duplicated in `client_bookings`, `provider_bookings`, and both history pages with only minor prop differences.

```jsx
// Usage
<BookingCard
  booking={booking}
  viewAs="client" // or "provider"
  onView={handleView}
  onCancel={handleCancel}
/>
```

- [ ] Create `BookingCard` with `viewAs` prop that swaps client vs provider perspective
- [ ] Replace inline card in 4 pages

---

### 2e. `EmptyState` — `components/ui/EmptyState.jsx`

Empty list state (icon + heading + description + optional CTA) appears on every bookings/history page.

```jsx
// Usage
<EmptyState
  icon={<Calendar />}
  heading="No bookings yet"
  description="Your confirmed bookings will appear here."
  action={{ label: "Browse Services", to: "/Service" }}
/>
```

- [ ] Create `EmptyState` component
- [ ] Replace inline empty states in 6+ pages

---

### 2f. `FilterBar` — `components/ui/FilterBar.jsx`

Filter button group with badge counts appears in both bookings pages and both history pages.

```jsx
// Usage
<FilterBar
  filters={[
    { key: "all", label: "All", count: 12 },
    { key: "pending", label: "Pending", count: 3 },
  ]}
  active={activeFilter}
  onChange={setActiveFilter}
/>
```

- [ ] Create `FilterBar` component
- [ ] Replace in 4 pages

---

### 2g. `SearchInput` — already in `ui/Input.jsx` but needs a search variant

The search-with-icon pattern (magnifier prefix + clear button) should be a named variant, not re-implemented inline.

- [ ] Add `variant="search"` to existing `Input` component
- [ ] Replace raw search inputs in `client_bookings`, `provider_bookings`, `messagelist`

---

### 2h. `ActivityItem` — `components/ui/ActivityItem.jsx`

Recent activity rows (icon + title + description + timestamp) exist as local components inside `provider_dashboard` but are never exported.

- [ ] Extract as standalone component
- [ ] Use in `client_dashboard` and `provider_dashboard`

---

## 3. Inconsistent Primitive Usage

### 3a. Raw `<input>` / `<textarea>` vs `<Input>` component

Several pages bypass the `Input` component and use raw HTML inputs, meaning validation styles, error messages, and label layout differ visually.

**Audit list — replace raw inputs:**

| File | Element | Action |
|---|---|---|
| `booking_request.jsx` | `<textarea>`, `<input type="date">`, `<input type="time">` | Replace with `<Input>` or extend `Input` to support these |
| `sign_up.jsx` | Some fields use raw `<input>` | Replace with `<Input>` |
| `edit.jsx` | Profile edit fields | Replace with `<Input>` |
| `messagelist.jsx` | Search bar | Use `<Input variant="search">` |
| `help_support.jsx` | Contact form fields | Replace with `<Input>` |

- [ ] Extend `Input` component to support `type="date"`, `type="time"`, `type="textarea"` via a `as` prop
- [ ] Audit every page and replace raw inputs

---

### 3b. Hardcoded Tailwind color classes vs theme tokens

Some pages use `blue-600`, `orange-700`, `green-500` etc. directly instead of `primary`, `secondary`, `success`.

**Pattern to eliminate:**

| Wrong | Correct |
|---|---|
| `text-blue-600` | `text-primary` |
| `bg-orange-700` | `bg-secondary` |
| `bg-green-500` | `bg-success` |
| `text-red-500` | `text-error` |
| `border-blue-300` | `border-primary-light` |

- [ ] Global search for `blue-[456]00`, `orange-[456]00`, `green-[456]00`, `red-[456]00` used as semantic colors
- [ ] Replace with theme tokens
- [ ] Remove `style={{}}` inline backgrounds in `Services.jsx` — convert to Tailwind classes

---

### 3c. Button inconsistency

The Navbar has custom-styled anchor/button elements instead of using the `<Button>` component. This causes the sign-in and sign-up call-to-action buttons to look different from the rest of the app.

- [ ] Replace custom navbar buttons with `<Button variant="primary">` and `<Button variant="outline">`

---

## 4. Typography Consistency

No centralised typography component exists — heading sizes are scattered.

### Required convention (implement via utility classes enforced by convention):

| Role | Classes |
|---|---|
| Page title | `text-3xl font-bold text-gray-900` |
| Section heading | `text-xl font-semibold text-gray-800` |
| Card title | `text-base font-semibold text-gray-800` |
| Body | `text-sm text-gray-600` |
| Label | `text-sm font-medium text-gray-700` |
| Caption / meta | `text-xs text-gray-500` |

- [ ] Create `components/ui/Typography.jsx` with `<Heading>`, `<Label>`, `<Caption>` components **or** document the class convention in CLAUDE.md so it is enforced at code-review time
- [ ] Audit `home.jsx`, `about.jsx`, `Services.jsx` for headline sizes — these pages have the most variation (`text-4xl` through `text-6xl` used loosely)

---

## 5. Mock Data — Booking Workflow Coverage

### Current mock data (`mockBookings.js`) — what it has

```
id, bookingReference, title, serviceType, status, urgency
providerId, clientId, locationId
bookingDate, scheduledDate, scheduledTime, completionDate
description, duration, images, additionalNotes
budget: { min, max }
quotedPrice, agreedPrice, priceBreakdown
priceAdjustment: { status, requestedBy, originalPrice, newPrice, reason }
paymentStatus
paymentData: { amount, platformFee, providerReceives, transactionId, paidAt }
completionRequest: { status, requestedBy, notes, timestamp }
cancellationRequest: { status, requestedBy, reason }
rating, review
```

**This is well structured.** The gaps below are workflow-state gaps, not schema gaps.

---

### 5a. Missing workflow states in mock data

The full booking lifecycle is:

```
PENDING → CONFIRMED → IN-PROGRESS → COMPLETED (awaiting payment) → PAID → reviewed
                  ↘ CANCELLED
```

**Gaps:**

| State | Issue |
|---|---|
| `completed` + `paymentStatus: "unpaid"` | Need at least 2 bookings in this state so `client_bookings` "awaiting payment" filter has data |
| `completed` + `paymentStatus: "paid"` + no `review` | Need at least 2 so the review prompt flow can be tested |
| `confirmed` with a `priceAdjustment.status: "pending"` | Needed to test the price negotiation UI |
| `in-progress` with `completionRequest.status: "pending"` | Needed to test provider marking complete + client confirmation |
| A booking where `cancellationRequest.status: "pending"` (client requested, provider hasn't responded) | Needed to test cancellation approval flow |

- [ ] Add 2 bookings: `completed` + `paymentStatus: "unpaid"` + no review
- [ ] Add 2 bookings: `confirmed` + `priceAdjustment.status: "pending_client"` 
- [ ] Add 1 booking: `in-progress` + `completionRequest.status: "pending"` (provider requested)
- [ ] Add 1 booking: `pending` + `cancellationRequest.status: "pending"` (client requested cancel, provider hasn't responded)

---

### 5b. Booking request form → mock data mismatch

`booking_request.jsx` collects 4 steps of data. Verify each field maps to the mock schema:

| Form field | Mock field | Status |
|---|---|---|
| Service type / category | `serviceType` | ✅ |
| Description | `description` | ✅ |
| Urgency | `urgency` | ✅ |
| Budget min/max | `budget.min`, `budget.max` | ✅ |
| Preferred date | `scheduledDate` | ✅ |
| Preferred time | `scheduledTime` | ✅ |
| Location / address | `locationId` → resolved via `mockProfiles` | ⚠️ The form collects a free-text address; the mock uses `locationId`. The confirmation page should show the resolved address, not just the ID. |
| Images | `images[]` | ✅ |
| Additional notes | `additionalNotes` | ✅ |
| Provider selection | `providerId` | ⚠️ The booking form doesn't appear to set this — it may be set on the selected_service page. Verify the handoff. |

- [ ] Ensure `booking_request.jsx` receives and saves `providerId` from the previous page (via router state or context)
- [ ] On `booking_confirmation.jsx`, resolve `locationId` to a human-readable address for display

---

### 5c. User/session context

There is no `currentUser` mock in the data layer. Pages that filter by `clientId` or `providerId` hardcode IDs or have no filter, meaning all users see all bookings.

- [ ] Add `mockCurrentUser.js` exporting two objects: `MOCK_CLIENT` (id matching bookings) and `MOCK_PROVIDER` (id matching bookings)
- [ ] Import in `client_bookings`, `provider_bookings`, `client_dashboard`, `provider_dashboard` and use these IDs as the filter source
- [ ] This makes the UI behave as if a real user is logged in

---

## 6. UI Cohesion & Immersion Checks

### 6a. Pages that feel visually disconnected

| Page | Issue |
|---|---|
| `home.jsx` | Large hero with orange/blue gradients — confirm this matches the rest of the app's tone |
| `about.jsx` | Check heading scale consistency with home page |
| `Services.jsx` | Uses inline `style={{}}` backgrounds — breaks with theme |
| `sign_in.jsx` / `sign_up.jsx` | Verify they use the same card shadow and input style as the rest of the app |
| `help_support.jsx` | Contact form — verify `<Input>` component is used, not raw `<input>` |
| `earnings.jsx` | Chart colours — verify they use theme palette not hardcoded hex |

---

### 6b. Animation / performance

The project uses Framer Motion extensively. Potential jank sources:

- `staggerContainer` + `staggerChildren` on large lists (bookings pages) can cause visible delay when list has many items
- `AnimatePresence` on modals — verify exit animations don't cause layout shift
- The Leaflet map (`ServicesMap`) loads a tile layer — verify it has a loading skeleton so it doesn't cause CLS

- [ ] Cap stagger delay at `0.05s` per item and max out at 10 animated items (skip animation for items beyond index 9)
- [ ] Add a `min-h` placeholder to `ServicesMap` so the page doesn't jump on load
- [ ] Verify no `useEffect` fetches (even mock ones) are running without cleanup

---

### 6c. Mobile responsiveness

- [ ] Verify `navbar.jsx` mobile menu closes when a link is clicked
- [ ] Verify `booking_request.jsx` 4-step form is usable on a 375px viewport
- [ ] Verify modals (`BookingDetailsModal`, `PaymentModal`) don't overflow on small screens — use `overflow-y-auto` with `max-h`
- [ ] Verify `earnings_chart.jsx` chart is responsive (recharts `<ResponsiveContainer>` should be used)

---

## 7. Verification Checklist

Run through this checklist after all changes above are complete to confirm nothing is broken.

### Booking flow (end-to-end)
- [ ] Browse `Service` → pick a category → `selected_service` → click "Book Now"
- [ ] Complete all 4 steps of `booking_request` with valid data
- [ ] Reach `booking_confirmation` and confirm all submitted fields are shown correctly
- [ ] As client: go to `client_bookings` → see new booking in PENDING state
- [ ] As provider: go to `provider_bookings` → see and accept the booking (CONFIRMED)
- [ ] Provider marks in-progress → CONFIRMED → IN-PROGRESS
- [ ] Provider requests completion → client confirms → COMPLETED
- [ ] Client pays → PAID
- [ ] Client leaves review → booking shows review

### UI consistency
- [ ] All buttons on the same page use the same size and variant for equivalent actions
- [ ] All status badges look identical across client and provider views
- [ ] All page headers use `PageHeader` component
- [ ] All empty states use `EmptyState` component
- [ ] No raw `<input>` outside of `<Input>` component wrappers (except `type="checkbox"` and `type="radio"`)
- [ ] No `style={{}}` inline CSS (except SVG/canvas contexts)
- [ ] No hardcoded `blue-`, `orange-`, `green-`, `red-` classes used for semantic meaning

### Performance
- [ ] No console errors or warnings on any page
- [ ] No layout shift on `ServicesMap` load
- [ ] Booking list with 10+ items doesn't stutter on scroll
- [ ] Modal open/close animations are smooth (60fps)

---

## Priority Order

**Do these first (highest leverage / unblocks everything else):**

1. Add `mockCurrentUser.js` and wire it to dashboard/bookings pages
2. Fill mock data workflow-state gaps (§5a)
3. Create `StatusBadge`, `BookingCard`, `EmptyState` components and replace inline code
4. Replace raw `<input>` elements with `<Input>` component
5. Replace hardcoded Tailwind color classes with theme tokens

**Do these second (polish):**

6. Create `PageHeader`, `StatCard`, `FilterBar`, `ActivityItem`
7. Fix `Services.jsx` inline styles
8. Fix Navbar button styling
9. Typography convention audit
10. Mobile + animation audit

**Do these last (structural cleanup):**

11. Folder reorganisation (components/carousels, components/earnings, etc.)
12. File rename to consistent casing
13. Add `CLAUDE.md` with design system conventions

---

*Generated: 2026-05-08*
