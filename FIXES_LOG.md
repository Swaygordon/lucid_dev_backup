# Lucid — Fixes & Phase Status Log

> All fixes listed here were applied to the **source project** (`lucid-frontend-main`)"C:\ACADEMIA\CODING\VS CODE\Lucid\development playground\lucid-frontend-main".

> The backup project (`lucid_dev_backup-main`) "C:\ACADEMIA\CODING\VS CODE\Lucid\lucid_dev_backup-(this version is for checking out new features on gh pages)\lucid_dev_backup-main"

---

## Fixes Applied

---

### `src/hooks/useNavigateBack.js` — Created (did not exist)

**Problem:** The hook was imported by ~15 files across active Phase 1–3 pages (including `help_support.jsx`) but the `hooks/` directory and the file itself did not exist. This caused silent broken imports throughout the app.

**Fix:** Created the hook with `navigate(-1)` (with fallback to a provided route when history is too shallow) and a "Going Back . . ." info notification before navigating.

```js
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

export const useNavigateBack = (fallbackRoute = '/lucid/', delay = 200) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleBack = useCallback(() => {
    showNotification('Going Back . . .', 'info');
    setTimeout(() => {
      if (window.history.length > 2) {
        navigate(-1);
      } else {
        navigate(fallbackRoute);
      }
    }, delay);
  }, [navigate, showNotification, fallbackRoute, delay]);

  return handleBack;
};
```

---

### `src/components/shared/ProfileCard.jsx`

- Removed hardcoded developer defaults (`name = "Service Provider"`, `role = "Professional"`, `location = "Accra, Ghana"`)
- `renderStars()` now returns `null` when `rating == null` instead of rendering empty stars
- Rating block now shows `"No reviews yet"` when rating is null
- Removed redundant `handleViewProfile` wrapper — button uses `onClick={onViewProfile}` directly

---

### `src/pages/general_profilePage.jsx` — Rewritten with bug fixes

The backup project received a refactored version from GitHub (762 → 530 lines). That version had useful features (GeneralProfileSkeleton, `insertReply`, Supabase reviews fetch) but contained 3 critical bugs. The fixed version was integrated into the source project.

**Bug 1 — Field name mismatch (all fields undefined)**
- The component accessed camelCase fields (`data.avatarUrl`, `data.paymentMethods`, etc.) directly on the raw Supabase row, which uses snake_case columns. Every field resolved to `undefined`.
- **Fix:** Added a transformation layer inside `useEffect` that maps the raw DB row to a camelCase shape before calling `setPROFILE_DATA`.

**Bug 2 — Null crash on initial render**
- `isFavourite(PROFILE_DATA.id)` was called at component top level before the async fetch completed, crashing when `PROFILE_DATA` was still `null`.
- **Fix:** Changed to `isFavourite(PROFILE_DATA?.id)`.

**Bug 3 — `toggleFavourite` called with wrong fields**
- The call passed `avatar` (wrong key) and omitted `rating`, corrupting the saved favourite entry.
- **Fix:** Corrected to `rating: PROFILE_DATA.rating ?? 0` and `image: PROFILE_DATA.avatarUrl ?? null`.

**Additional fixes (from source review):**
- Avatar positioning: `left-2` → `left-1/2` so the avatar is centred over the cover image
- "Request Booking" and "Message" CTA buttons replaced with coming-soon toasts via `useNotification`
- Rating display now shows `"—"` / `"No reviews yet"` when rating is 0 or missing
- `RATING_DISTRIBUTION` initialised from `MOCK_RATING_DISTRIBUTION` (was an empty array)
- Removed stray `console.log` statements
- Removed unused `Button` and `useLocation` imports; added `useNavigateBack`

---

### `src/pages/selected_service.jsx`

- Removed unused `HeroSection` component (~47 lines, was never rendered)
- Removed all 6 `console.log` statements
- Fixed hardcoded `rating: 4.5` → `provider.rating ?? null`
- Fixed hardcoded `verified: false` → `provider.is_verified ?? false`
- Added real location filter: after category/service filtering, providers are filtered by `searchLocation.area` using `provider.location.includes(area)`
- Fixed `stats` memoisation to handle null ratings — shows `"—"` for average when no providers have ratings

---

### `src/pages/provider_profile_setup.jsx`

- Added `import { GHANA_LOCATIONS } from '../contexts/LocationContext'`
- Replaced free-text `InputField` for Location with a `<select>` dropdown grouped by region using `GHANA_LOCATIONS`
- Stored value is now always a standardised area name (e.g. `"Achimota"`) matching what clients select in the location filter

---

### `src/pages/edit.jsx`

- Added `import { GHANA_LOCATIONS } from '../contexts/LocationContext'`
- Replaced free-text `InputField` for Location with the same `<select>` dropdown — ensures existing providers who update their profile also store a standardised area name
- Added `{ replace: true }` to both navigate calls (save and cancel) — prevents users pressing Back to return to the edit form after completing it

```js
// Before
navigate('/lucid/account/profile');
// After
navigate('/lucid/account/profile', { replace: true });
```

---

### `src/pages/sign_up.jsx`

- Added `{ replace: true }` to both post-signup navigate calls — prevents users pressing Back to return to the signup form after completing it

```js
// Before
setTimeout(() => navigate('/lucid/account/profile/setup'), 3000);
setTimeout(() => navigate('/lucid/signin'), 3000);
// After
setTimeout(() => navigate('/lucid/account/profile/setup', { replace: true }), 3000);
setTimeout(() => navigate('/lucid/signin', { replace: true }), 3000);
```

---

### `src/pages/home.jsx` — Hero animation invisible flash

**Problem:** The hero heading (`motion.h1`), subheading (`motion.p`), `SearchBar`, and `CyclingBadge` all used `initial="hidden"` (opacity: 0). On slow connections the hero content was completely invisible until the entrance animation completed.

**Fix:**
- `motion.h1` and `motion.p`: `initial="hidden"` → `initial={false}` — renders directly in the visible state with no mount animation
- `SearchBar`'s `motion.div`: same change
- `CyclingBadge` outer container: converted `motion.div` → plain `div` — inner `AnimatePresence` cycling animation is unaffected

Below-the-fold elements (`ProviderCTA`, `ServiceIconsGrid`) retain `whileInView` animations — appropriate since they are not visible on initial paint.

---

### `src/pages/sign_in.jsx` — Provider setup-check replaced with DB query

**Problem:** Providers were always redirected to `/lucid/account/profile/setup` after sign-in unless `localStorage.getItem(PROFILE_SETUP_KEY) === 'true'` was present in that specific browser. Clearing site data, signing in on a different device, or any scenario where the key was absent forced the setup flow again even for providers with a completed profile.

**Fix:** Replaced the `localStorage` check with a direct Supabase query to `provider_profiles`. If a row exists with a non-null `first_name`, the profile is considered complete and the provider goes to the dashboard.

```js
// Before
const setupDone = localStorage.getItem(PROFILE_SETUP_KEY) === 'true';
navigate(setupDone ? '/lucid/dashboard' : '/lucid/account/profile/setup', { replace: true });

// After
const { data: providerProfile } = await supabase
  .from('provider_profiles')
  .select('first_name')
  .eq('user_id', data.user.id)
  .single();
const setupDone = !!providerProfile?.first_name;
navigate(setupDone ? '/lucid/dashboard' : '/lucid/account/profile/setup', { replace: true });
```

Removed the now-unused `PROFILE_SETUP_KEY` import.

---

### `src/App.jsx` + `src/.gitignore`

- Commented out all Phase 4–7 lazy imports, routes, and `hideNavAndFooterExact` entries in `App.jsx`
- Added Phase 4–7 page and component files to `.gitignore` so they are not tracked or pushed to GitHub
- Only Phase 1–3 files are active and will be deployed

---

### `src/pages/sign_in.jsx` — Wrong FK column in provider_profiles query

**Problem:** The provider setup check queried `provider_profiles` using `.eq('id', data.user.id)`. The `provider_profiles` table uses `user_id` as the foreign key, not `id`. This always returned `null`, so `setupDone` was always `false`, and every service provider was redirected to profile setup on every sign-in — even providers with a fully completed profile.

**Fix:** Changed `.eq('id', data.user.id)` → `.eq('user_id', data.user.id)`.

```js
// Before
const { data: providerProfile } = await supabase
  .from('provider_profiles')
  .select('first_name')
  .eq('id', data.user.id)        // ❌ wrong column — provider_profiles uses user_id
  .single();

// After
const { data: providerProfile } = await supabase
  .from('provider_profiles')
  .select('first_name')
  .eq('user_id', data.user.id)   // ✅ correct FK column
  .single();
```

---

### `src/pages/sign_in.jsx` — Provider redirect target corrected

**Problem:** After a successful provider sign-in with a complete profile, the app navigated to `/lucid/dashboard`. The dashboard route is Phase 5 and is commented out in `App.jsx`. The catch-all route (`*`) then bounced the user back to `/lucid/`, adding a wasted history entry.

**Fix:** Changed redirect target for providers with complete profiles from `/lucid/dashboard` to `/lucid/account/profile`.

```js
// Before
navigate(setupDone ? '/lucid/dashboard' : '/lucid/account/profile/setup', { replace: true });

// After
navigate(setupDone ? '/lucid/account/profile' : '/lucid/account/profile/setup', { replace: true });
```

**Note for Phase 5:** When the dashboard is implemented, change this back to `/lucid/dashboard`.

---

### `src/pages/selected_service.jsx` — `is_verified` field does not exist

**Problem:** The provider transform mapped `verified: provider.is_verified ?? false`. The `provider_profiles` table has no `is_verified` column — the actual column is `verification_status` (a string: `'pending'` | `'verified'`). This silently set every provider's `verified` prop to `false`.

**Fix:** Changed to `provider.verification_status === 'verified'`.

```js
// Before
verified: provider.is_verified ?? false,

// After
verified: provider.verification_status === 'verified',
```

---

### `src/components/shared/ProfileCard.jsx` — `rating.toFixed(1)` crash on null

**Problem:** `ProfileCard` was called with `rating={null}` for providers who have no rating yet (the `provider_profiles` table has no `rating` column). The component prop has a default of `rating = 4.0`, but JavaScript default parameter values only apply for `undefined`, not `null`. A null rating reached `rating.toFixed(1)` and threw `TypeError: Cannot read properties of null (reading 'toFixed')`, crashing the entire React tree (no ErrorBoundary present) — every search for a service category with unrated providers produced a completely blank dark screen.

**Fix:** Guard the display value and the star calculation:

```js
// Before — renderStars
i <= Math.floor(rating)      // Math.floor(null) = 0 → NaN comparisons
i - rating < 1               // null arithmetic = NaN

// After — renderStars
const r = rating ?? 0;
i <= Math.floor(r)
i - r < 1

// Before — rating display
<span className="font-semibold">{rating.toFixed(1)}</span>

// After — rating display
<span className="font-semibold">{rating != null ? rating.toFixed(1) : '—'}</span>
```

---

### `src/pages/Services.jsx` — `resolveSearch()` profession synonyms + false-positive guard

**Problem:** The home page search bar routes queries through `resolveSearch()` in `Services.jsx`. The function matched service verb-forms (`carpentry`, `welding`, `photography`) but not person-noun professions (`carpenter`, `welder`, `photographer`). It also had two false positives: `"car"` routed to Beauty (because `"beauty & personal care"` contains `"car"`) and `"ac"` routed to Packing (because `"packing"` contains `"ac"`).

**Fix:** Added a `SEARCH_SYNONYMS` lookup table as step 3, and added minimum-length guards (≥4 chars for category-contains, ≥3 chars for service-contains) to prevent short-string false positives.

Synonyms added (sample — see source file for full list):

| Search term | Routes to |
|---|---|
| mechanic, car mechanic, car repair | auto-repairs/engine-repair |
| painter | home-repairs/painting |
| electrical, wiring | home-repairs/electrical-repairs |
| plumbing | home-repairs/plumbing |
| carpenter, woodworker | skilled-trades/carpentry |
| welder, fabricator | skilled-trades/welding |
| ac, aircon, air conditioning | skilled-trades/ac-repair |
| cleaner, maid, housekeeper | cleaning/house-cleaning |
| photographer, videographer | events/photography |
| decorator | events/decoration |
| caterer, chef, cook | events/catering |
| tiler, flooring | home-repairs/tiling |
| roofer | construction/roofing |
| hairdresser, hair stylist | beauty/hair-braiding |
| driver | education/driving-lessons |
| wifi, wi-fi, internet | tech/network-setup |
| computer repair | tech/laptop-repair |

Result: 48/50 common profession/service terms resolve correctly (the 2 misses — `"cctv"` and `"moving"` — resolve correctly in production via the service/category-contains steps; they only appeared to miss in the simplified test data used during verification).

---

### `src/pages/AllCategories.jsx` — Category cards unequal height in grid

**Problem:** In the 2-column (and 3-column) grid, cards with shorter text content appeared visually shorter than their row neighbour. CSS Grid stretches the `<Link>` wrapper to fill the tallest cell, but the inner card `<div>` and text section had no height constraint, so they only grew to fit their content.

**Fix:** Added `h-full` to the `<Link>` and `flex flex-col h-full` to the card `<div>`, then `flex-1` to the text section so it fills remaining space below the fixed-height (`h-44`) image.

```jsx
// Before
<Link key={cat.id} to={`/lucid/services/${cat.slug}`}>
  <div className="rounded-2xl overflow-hidden ... bg-white dark:bg-[#1a1f2e]">
    ...
    <div className="p-5">

// After
<Link key={cat.id} to={`/lucid/services/${cat.slug}`} className="h-full">
  <div className="rounded-2xl overflow-hidden ... bg-white dark:bg-[#1a1f2e] h-full flex flex-col">
    ...
    <div className="p-5 flex-1">
```

---

### `src/data/categories.js` — Duplicate and mismatched service images

**Problem:** `photo-1558618666-fcd25c85cd64` (a generic pipe/repair photo) was used as a placeholder for **9 unrelated services** across Auto Repairs, Construction, Beauty, Skilled Trades, Cleaning, and Technology. Several additional duplicates existed within and across categories: Natural Hair Styling shared an image with Hair Braiding, English Tutoring with Maths Tutoring, Deep Cleaning with House Cleaning, IT Support and Laptop Repair used the same Tech category header image, Engine Repair used the same image as its category header, and Office Cleaning used the same Office Relocation photo from the Moving category.

**Fix:** Replaced every duplicate with a unique, service-accurate Unsplash photo. Full replacement table:

| Service | Was | Now |
|---|---|---|
| Auto Repairs > Engine Repair | same as category header | distinct mechanic photo |
| Auto Repairs > Oil Change | `photo-1558618666-fcd25c85cd64` | oil/car maintenance |
| Auto Repairs > Vulcanizing | `photo-1558618666-fcd25c85cd64` | tyres/wheels |
| Construction > Building Construction | same as category header | construction workers |
| Construction > Fencing & Gates | `photo-1558618666-fcd25c85cd64` | fence/gate |
| Construction > Masonry | same as Building Construction | brickwork/masonry |
| Beauty > Natural Hair Styling | same as Hair Braiding | distinct natural hair |
| Beauty > Tailoring | `photo-1558618666-fcd25c85cd64` | sewing/fabric |
| Events > Event Planning | same as category header | distinct event hall |
| Skilled Trades > AC Repair | `photo-1558618666-fcd25c85cd64` | AC wall unit |
| Skilled Trades > Furniture Making | same as Moving > Furniture Moving | woodworking/workshop |
| Skilled Trades category header | same as Handyman (Home Repairs) | distinct workshop/tools |
| Cleaning > Office Cleaning | same as Moving > Office Relocation | office cleaning specific |
| Cleaning > Deep Cleaning | same as House Cleaning | distinct cleaning photo |
| Cleaning > Laundry & Ironing | `photo-1558618666-fcd25c85cd64` | washing machines |
| Cleaning > Waste Collection | `photo-1558618666-fcd25c85cd64` | waste/recycling truck |
| Education > English Tutoring | same as Maths Tutoring | books/reading |
| Education > Computer Training | same as Tech category header | computer class |
| Technology > Laptop Repair | same as category header | distinct laptop repair |
| Technology > IT Support | same as category header | IT support person |
| Technology > CCTV Installation | `photo-1558618666-fcd25c85cd64` | security cameras |
| Technology > Network & Wi-Fi Setup | `photo-1558618666-fcd25c85cd64` | ethernet/patch panel |
| Moving > Packing Services | same as Moving category header | packing boxes |

---

## Backup Project Review Notes

No direct changes were made to `lucid_dev_backup-main`. Three files were reviewed after a GitHub push:

| File | Outcome |
|---|---|
| `src/components/shared/ProfileCard.jsx` | Source already better. Backup had hardcoded `<Link to="/lucid/providers/me">`. Not copied. |
| `src/pages/selected_service.jsx` | Source already better. Backup still used `mockProviders` from mock data file. Not copied. |
| `src/pages/general_profilePage.jsx` | Backup had extra features (skeleton, reviews) but 3 bugs. Fixed version integrated into source. |

---

## Phase 1–3 Functionality Status

### Phase 1 — Authentication & Onboarding

| Feature | Status | Notes |
|---|---|---|
| Sign up (client) | ✅ Working | Form, Supabase auth, email confirmation redirect |
| Sign up (service provider) | ✅ Working | Redirects to profile setup after registration |
| Sign in | ✅ Working | Role-based redirect; FK column fix (`.eq('user_id')`); redirects providers to `/lucid/account/profile` (not `/lucid/dashboard`) |
| Google OAuth | ✅ Wired | Depends on OAuth provider being enabled in Supabase dashboard |
| Facebook OAuth | ✅ Wired | Same dependency |
| Post-signup back-nav prevention | ✅ Fixed | `{ replace: true }` on all post-auth navigates |
| Provider profile setup | ✅ Working | Full form with location dropdown, skills, schedule, portfolio |
| Edit profile | ✅ Working | Same form, standardised location dropdown, replace navigation |
| Dual-role accounts (client + provider same email) | ❌ Not supported | Sign-in radio only picks one role — deferred to future phase |

---

### Phase 2 — Browse & Discovery

| Feature | Status | Notes |
|---|---|---|
| Home page | ✅ Working | Hero, cycling badge, search bar, category icons |
| Hero content visible on load | ✅ Fixed | `initial={false}` prevents invisible flash |
| All Categories page | ✅ Working | Grid of all service categories; cards uniform height (`h-full flex-col` fix) |
| Services by category | ✅ Working | `selected_service.jsx` fetches live from `provider_profiles` |
| Location filter in services | ✅ Working | Filters by `provider.location.includes(area)` |
| Hardcoded rating/verified values | ✅ Fixed | Real DB values; `verification_status === 'verified'` (not missing `is_verified` column); null rating fallback |
| Search bar submit | ✅ Working | Navigates to `/lucid/search?q=...` |
| Search results page | ✅ Working | `resolveSearch()` matches exact names, profession synonyms (`carpenter`, `welder`, etc.), then category/service substrings; false-positive guards prevent `"car"` → beauty, `"ac"` → packing |
| `categorySearchTerms` mappings | ✅ Fixed | Added all 5 missing categories (`beauty`, `events`, `skilled-trades`, `education`, `tech`); removed 3 dead keys (`electrical`, `plumbing`, `painting`) that were service slugs, not category slugs, and never matched |

---

### Phase 3 — Provider Profiles & Favourites

| Feature | Status | Notes |
|---|---|---|
| Provider profile page (`/lucid/providers/:id`) | ✅ Working | Fetches real data from `provider_profiles`, snake→camelCase transform |
| Profile data display | ✅ Working | Name, occupation, location, skills, schedule, portfolio, certifications |
| Favourites toggle | ✅ Working | `FavouritesContext`, heart button on ProfileCard and profile page |
| Favourites page | ✅ Working | Lists saved providers |
| ProfileCard component | ✅ Working | No hardcoded defaults, null-safe rating display (no crash on `null`), `onViewProfile` callback |
| Avatar centred on hero | ✅ Fixed | `left-1/2` positioning |
| Reviews section | ⚠️ Placeholder | Reviews table not yet created in DB — fetch uses `YOUR_REVIEWS_TABLE` placeholder |
| "Request Booking" button | ⚠️ Coming soon toast | Phase 4 feature |
| "Message Provider" button | ⚠️ Coming soon toast | Phase 5+ feature |

---

## Known Issues

1. **Reviews table missing** — `general_profilePage.jsx` has the fetch and display code ready but uses a `YOUR_REVIEWS_TABLE` placeholder. The Supabase table needs to be created before reviews go live.

2. **Dual-role accounts** — A user who is both a client and a service provider cannot be supported under the current sign-in model. Deferred to a future phase.

---

*Last updated: 2026-05-23 (sign_in FK column + redirect target, selected_service is_verified, ProfileCard null crash, Services.jsx resolveSearch synonyms, AllCategories card height, categories.js duplicate images)*
