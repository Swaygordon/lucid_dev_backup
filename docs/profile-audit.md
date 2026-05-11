# Provider Profile — Edit & Display Audit

## Summary

`edit.jsx` and `general_profilePage.jsx` do **not** correlate. Data entered in the edit
page is never persisted (the save handler is a fake timeout), the field shapes are
incompatible between the two pages, the hero background and project carousel are
completely disconnected, and the profile picture upload is wired to an empty callback.
None of the rich data the provider fills in (working hours, payment method, certifications,
languages, portfolio) actually appears on their public profile.

---

## Field-by-Field Comparison

| What the provider edits | Field in `edit.jsx` | What the profile shows | Field in `general_profilePage.jsx` | Match? |
|---|---|---|---|---|
| First + Last + Other name | `firstName`, `lastName`, `otherName` | Single combined string | `PROFILE_DATA.name` | ⚠️ Partial — other name lost |
| Job title | `occupation` | `PROFILE_DATA.role` (account type, not title) | `role` from Supabase profiles | ❌ Wrong field |
| Location | `location` | `PROFILE_DATA.location` | `location` from profiles hook | ✅ Matches |
| Bio | `description` | `PROFILE_DATA.bio` | `bio` from profiles hook | ⚠️ Different field names |
| Skills | `skills[]` | `PROFILE_DATA.skills[]` | profiles hook | ✅ Matches shape |
| Certifications | `certifications[]` | `PROFILE_DATA.certifications[]` | profiles hook | ✅ Matches shape |
| Languages | `languages[]` | `PROFILE_DATA.languages[]` | profiles hook | ✅ Matches shape |
| Employees | `employees` (number) | `PROFILE_DATA.employees` | profiles hook | ✅ Matches |
| Experience | `workExperience` | `PROFILE_DATA.experience` | profiles hook | ⚠️ Different key names |
| Pricing | `pricingType` + `amount` | Not displayed anywhere | — | ❌ Missing from profile |
| Payment method | `paymentMethod` ('mobile'/'bank' key) | `PROFILE_DATA.paymentMethods` (plain string) | profiles hook | ❌ Shape mismatch |
| Working hours | Complex object `{weekdays:{start,end}, weekend:{start,end}, customDays:{}}` | Two plain strings `workingHours.weekdays` / `.weekends` | profiles hook | ❌ Completely incompatible |
| Profile picture | `ImageUploadModal` → `onUpload={() => {}}` | `hasImage={false}` hardcoded | always shows placeholder | ❌ Never saved or displayed |
| Hero background image | No dedicated UI — banner modal title present but no state | Static CSS gradient only | no image field | ❌ Both sides missing |
| Portfolio projects | Single upload area (same modal as profile picture) | Hardcoded local assets `[slide1, slide2, slide3, slide4]` | never reads uploaded images | ❌ Completely disconnected |

---

## Detailed Inconsistencies

### 1. Save handler does nothing
`handleSave` in `edit.jsx` runs a fake `setTimeout` and navigates to the dashboard.
No data is written to Supabase. Every field the provider edits is discarded on save.

### 2. Occupation shown as account role
The edit page has an `occupation` field (e.g. "Web Developer"). The profile page
renders `PROFILE_DATA.role`, which comes from the Supabase `profiles.role` column —
this stores `client` or `service_provider`, not a job title. A client visiting the
profile would see "service_provider" as the provider's occupation.

### 3. Working hours are incompatible shapes
The edit page builds a rich object:
```js
weekdaysTime: { start: '09:00', end: '17:00' }
weekendTime:  { start: '10:00', end: '16:00' }
customDays:   { monday: { selected: true, start: '08:00', end: '18:00' }, ... }
```
The profile page expects two plain strings:
```js
PROFILE_DATA.workingHours.weekdays  // e.g. "9am – 5pm"
PROFILE_DATA.workingHours.weekends  // e.g. "Closed"
```
Even if the save worked, the display could never render the data correctly.

### 4. Payment method key vs display string
Edit stores a key (`'mobile'` or `'bank'`). The profile renders a raw string
(`"This user accepts mobile"`). There is no mapping layer, and the field name
on the profiles hook differs (`paymentMethod` vs `paymentMethods`).

### 5. Profile picture upload is a dead end
`ImageUploadModal` is opened but its `onUpload` callback is `() => {}`. The avatar
component always receives `hasImage={false}` and always renders the placeholder SVG.
No URL is ever saved to Supabase `profiles.avatar_url`.

### 6. Hero background has no edit UI and no display
The edit page's `ImageUploadModal` has the title "Upload Banner Image" but is
triggered by the same button as the profile picture. There is no separate state for
a banner URL. The profile page renders a hardcoded CSS gradient — it never reads a
background image from anywhere.

### 7. Portfolio is completely disconnected
Edit page: one upload area that opens the same shared modal, no state to hold
existing images, no delete functionality.
Profile page: `const PROJECTS = [slide1, slide2, slide3, slide4]` — four hardcoded
local assets. The `ProjectCarousel` always shows these regardless of what the
provider uploads.

### 8. Pricing is edited but never shown
The edit page has a full pricing section (set rate vs contact, amount in GHC).
Nothing on the public profile displays this information, and there is no field for
it in `EMPTY_PROFILE` or `useProviderProfile`.

### 9. `otherName` is collected but never displayed
The edit page collects a third name field. The profile only renders `PROFILE_DATA.name`
(a combined string). The other name is never shown anywhere.

---

## Recommended Design

### Supabase `profiles` table — required columns

Add or confirm these columns exist:

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | FK to auth.users |
| `full_name` | text | Derived: `firstName + ' ' + otherName + ' ' + lastName` on save |
| `avatar_url` | text | Uploaded to Supabase Storage |
| `hero_url` | text | Banner background, uploaded to Supabase Storage |
| `occupation` | text | Job title, not the role enum |
| `bio` | text | |
| `location` | text | |
| `skills` | text[] | |
| `certifications` | text[] | |
| `languages` | text[] | |
| `employees` | int | |
| `work_experience` | int | years |
| `pricing_type` | text | `'set'` or `'contact'` |
| `pricing_amount` | int | GHC, null when type is `'contact'` |
| `payment_methods` | text[] | `['mobile_money', 'bank_transfer']` — array, not single |
| `working_hours` | jsonb | See shape below |
| `portfolio_urls` | text[] | Array of Storage URLs |

**`working_hours` jsonb shape** (matches what the edit form builds):
```json
{
  "weekdays": { "enabled": true,  "start": "09:00", "end": "17:00" },
  "weekend":  { "enabled": false, "start": "10:00", "end": "16:00" },
  "custom": {
    "enabled": false,
    "days": {
      "monday": { "selected": true, "start": "08:00", "end": "18:00" }
    }
  }
}
```

---

### `edit.jsx` — required changes

1. **Load real data on mount** — fetch from Supabase `profiles` where `id = session.user.id`
   and pre-fill all form fields.

2. **Save to Supabase** — `handleSave` should PATCH the `profiles` row:
   ```js
   await supabase.from('profiles').update({
     full_name:        `${firstName} ${otherName} ${lastName}`.trim(),
     occupation,
     bio:              description,
     location,
     skills,
     certifications,
     languages,
     employees,
     work_experience:  workExperience,
     pricing_type:     pricingType,
     pricing_amount:   pricingType === 'set' ? amount : null,
     payment_methods:  [paymentMethod],
     working_hours:    { weekdays: weekdaysTime, weekend: weekendTime, custom: customDays },
   }).eq('id', session.user.id);
   ```

3. **Profile picture** — upload file to Supabase Storage, get public URL, update
   `profiles.avatar_url`. Pass the URL back to `ProfileAvatar` as `src`.

4. **Hero background** — add a separate "Change banner" button/section. Upload to Storage,
   update `profiles.hero_url`. Do not share the same modal with the profile picture.

5. **Portfolio projects** — maintain a `portfolioUrls` state array. Allow adding
   (upload → get URL → push to array) and deleting (remove from array). On save,
   write to `profiles.portfolio_urls`. Show thumbnail previews of existing uploads
   so the provider can manage them.

---

### `general_profilePage.jsx` — required changes

1. **`useProviderProfile` hook** — extend it to return all the new columns:
   `occupation`, `hero_url`, `avatar_url`, `pricing_type`, `pricing_amount`,
   `payment_methods[]`, `working_hours` (jsonb), `portfolio_urls[]`.

2. **Hero section** — if `profile.hero_url` exists, use it as a `backgroundImage`.
   Fall back to the current gradient.

3. **Avatar** — pass `profile.avatar_url` to `ProfileAvatar`. Show it when present.

4. **Occupation** — display `profile.occupation`, not `profile.role`.

5. **Pricing** — add a "Pricing" info card:
   - "Set rate: GH₵ {amount}" or "Contact for price"

6. **Payment methods** — map the array to readable labels:
   ```js
   { mobile_money: 'Mobile Money', bank_transfer: 'Bank Transfer' }
   ```

7. **Working hours** — derive display strings from the jsonb object instead of
   expecting pre-formatted strings.

8. **Portfolio projects** — replace the four hardcoded local assets with
   `profile.portfolio_urls`. If empty, hide the carousel or show a placeholder.

---

## Priority Order

| Priority | Task |
|---|---|
| 1 | Wire `edit.jsx` save to Supabase (all fields) |
| 2 | Fix profile picture — upload to Storage, save URL, display it |
| 3 | Add `hero_url` column + edit UI + display in profile |
| 4 | Fix `occupation` display on profile page |
| 5 | Fix working hours shape mismatch |
| 6 | Fix payment methods (array + label mapping) |
| 7 | Connect portfolio — manage uploads in edit, display URLs in profile |
| 8 | Add pricing display to public profile |
