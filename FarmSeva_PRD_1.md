# FarmSeva — Implementation-Ready PRD

*Tell us the farm work. We'll arrange the machinery.*

Source of truth: FarmSeva Strategy & MVP Plan (Phase 1). This PRD does not redo research or strategy — it converts the finalized plan into build-ready specification for an AI coding agent (e.g. Antigravity).

**Two corrections flagged from the strategy, applied below (both are scope-trims, nothing structural changes):**
1. The strategy already cut "Other" task type and "Basic service terms" text — confirmed cut here too, they add form/content overhead with zero demo payoff.
2. The strategy's screen list has 8 screens but lists Confirmation and My Bookings/Provider Dashboard separately from a distinct "Success" screen. For a 3-hour build, **Confirmation and Success are merged into one screen** (a confirmation screen that shows a success state) — a separate success screen is one extra route for no functional gain. This is reflected in the screen list and IA below.

---

# 1. Product Overview

FarmSeva is a task-first agricultural machinery marketplace for Indian farmers. It serves small and marginal farmers (primary) and machinery owners / Custom Hiring Centres / operators (secondary/provider side). The problem it solves: farmers know the *work* they need done, not necessarily the *machine* for it, and existing platforms (govt CHC/FARMS, TRRINGO, JFarm, EzyKheti, Shetu, and others) all still open with a machine-first search. FarmSeva's main business is complete farm-service booking (task → matched machine + provider + optional operator → booking). Its secondary business is direct equipment rental for farmers who already know what they need. Core USP: **"What farm work do you need?" instead of "Which machine do you want?"**

---

# 2. Product Goals

MVP goals:
- Make machinery discovery task-first instead of machine-first.
- Let a farmer book a complete farm service from a single task description.
- Let a farmer who already knows what they need rent individual equipment directly.
- Let providers manage machines, see bookings, and accept/reject/update them.
- Demonstrate, in one working prototype, a real two-sided marketplace loop: farmer books → provider acts → status updates → farmer sees it.

**The MVP is explicitly NOT trying to solve:** payments processing, real geolocation/maps, real-time provider messaging, crop advisory, weather/disease prediction, worker marketplace, IoT/telematics, multi-language i18n, authentication/security hardening, or true machine-learning recommendations. All of these are Future scope (Section 23/24).

---

# 3. User Types

## Farmer
Needs: describe farm work and get matched services; check availability; compare price/distance/rating; book a complete service; alternatively browse/search/rent individual equipment; optionally add an operator; track bookings.

## Provider
Needs: list/manage machines; set availability; see incoming booking requests; accept/reject; move a booking through status stages; see a simple earnings summary.

Workers/operators are **not** a separate primary user type in this MVP — operator is a boolean add-on inside a booking, tied to a machine's `operatorAvailable` flag. There is no operator login, operator profile, or operator marketplace.

---

# 4. Information Architecture

```
Home
├── Farm Services
│   ├── Task Selection
│   ├── Requirements Form
│   ├── Results
│   ├── Service Details
│   └── Booking Confirmation (incl. success state)
│
├── Equipment Rental
│   ├── Browse / Categories
│   ├── Search + Filters
│   ├── Equipment Details
│   └── Rental Confirmation (incl. success state)
│
├── My Bookings
│   └── Booking Details
│
└── Provider Dashboard
    ├── Overview
    ├── Machines
    └── Bookings
```

Note: Booking Details (My Bookings) and Service/Equipment Details (browse) reuse the same detail-card component with different data and a status badge instead of a "Book" button when already booked. Calendar and Earnings tabs from the original strategy are folded into Overview (Section 8) — a separate Calendar screen is Future scope; a full calendar view is not needed to demo booking status changes.

---

# 5. Screen Documentation Format

Every screen below is documented with: purpose, target user, entry point, layout, components, data displayed, user actions, button behavior, navigation, empty/loading/error/success states, and mobile behavior — not just visual description.

---

# 6. Farm Service Screens

## 6.1 Home
- **Purpose:** Explain the product in one line and route into the two flows.
- **Target user:** Farmer (first-time or returning).
- **Entry point:** App launch / logo click from anywhere.
- **Layout:** Top nav (logo, Home, Farm Services, Equipment Rental, My Bookings, Provider, Profile) + hero line "Tell us what farm work you need" + two CTA buttons + a short "how it works" 3-step strip.
- **Components:** Navbar, primary CTA button, secondary CTA button, 3-step icons row.
- **Data displayed:** Static copy only, no dynamic data.
- **User actions:** Click "Book Farm Service" (primary) → Task Selection. Click "Rent Equipment" (secondary) → Equipment Rental Browse.
- **Button behavior:** Both CTAs are real navigations, not scroll anchors.
- **Navigation:** Entry screen; back button not applicable.
- **Empty/loading/error:** None — fully static.
- **Success state:** N/A.
- **Mobile:** CTAs stack vertically, full width; nav collapses to a hamburger menu.

## 6.2 Farm Service — Task Selection
- **Purpose:** Capture the task type — first step of task-first intake.
- **Target user:** Farmer.
- **Entry point:** "Book Farm Service" from Home or Farm Services nav item.
- **Layout:** Page title "What work do you need done?" + grid of large tappable task cards with icons.
- **Components:** Task selector cards (Ploughing, Sowing, Spraying, Harvesting, Transport).
- **Data displayed:** Fixed task list (no "Other" — cut per scope note above).
- **User actions:** Tap a task card.
- **Button behavior:** Tapping a card selects it (visibly highlighted) and auto-advances to the Requirements Form after a short delay, or requires a "Next" button — pick one: use an explicit "Next" button so farmers can change their mind before advancing.
- **Navigation:** Back → Home. Next → Requirements Form (task carried in state).
- **Empty state:** N/A (fixed list).
- **Loading/error:** N/A.
- **Success:** Selected card shows a checkmark/highlight.
- **Mobile:** 2-column card grid instead of a row.

## 6.3 Farm Service — Requirements Form
- **Purpose:** Capture crop, area, location, date, time.
- **Target user:** Farmer.
- **Entry point:** After Task Selection.
- **Layout:** Selected task shown as a chip at top (editable — tapping it goes back to Task Selection); form fields below; "Find Services" button.
- **Components:** Crop dropdown/text input, Area number input (acres), Location text input (prefilled with a default demo location, e.g. Lucknow), Date picker, Time picker, primary button.
- **Data displayed:** Crop list (Wheat, Paddy, Potato, Sugarcane).
- **User actions:** Fill fields, tap "Find Services."
- **Button behavior:** "Find Services" is disabled until all fields are valid; on tap it runs the recommendation logic (Section 11) against mock machine data and navigates to Results.
- **Navigation:** Back → Task Selection (preserves task). Next → Results.
- **Empty state:** N/A.
- **Loading state:** Brief spinner/skeleton on "Find Services" tap (mock delay ~500ms is enough to feel real).
- **Error state:** Inline validation messages per field (e.g. "Enter a valid area").
- **Success:** Navigates to Results with populated data.
- **Mobile:** Fields stack full-width; date/time pickers use native mobile pickers where the framework supports it.

## 6.4 Service Results
- **Purpose:** Show ranked matches for the request.
- **Target user:** Farmer.
- **Entry point:** After Requirements Form submit.
- **Layout:** Request summary bar at top (task/crop/area/location/date/time, editable → back to form) + "Recommended for you" label + ranked list of service cards, top one badged "Best Match."
- **Components:** Service Card (machine name, provider, distance, price, pricing unit, availability, rating, operator badge), Sort dropdown (Recommended / Lowest price / Nearest / Highest rated), optional simple filter chips (price/distance) if time allows (Should-Build).
- **Data displayed:** Scored + sorted list of matching machines from mock data.
- **User actions:** Change sort, tap a card → Service Details.
- **Button behavior:** Sort changes re-render list instantly (client-side, no network).
- **Navigation:** Back → Requirements Form. Card tap → Service Details.
- **Empty state:** "No exact matches found nearby — showing closest alternatives" with a relaxed-match fallback list (never a dead end), OR if truly none, a message with a "Try Equipment Rental instead" CTA.
- **Loading state:** Skeleton cards while "computing" (mock delay).
- **Error state:** Not applicable for local mock data; if it were live, show a retry message.
- **Success:** Populated ranked list.
- **Mobile:** Single-column card stack.

## 6.5 Service Details
- **Purpose:** Full info on one matched service before booking.
- **Target user:** Farmer.
- **Entry point:** Tap a card in Results (or from Equipment Rental, shared template — see 7.5).
- **Layout:** Machine image, name, category, provider name/rating, location/distance, price + unit, availability slot, operator toggle, "Book Now" button.
- **Components:** Image block, rating stars, availability badge, operator toggle switch, sticky price/CTA bar (especially on mobile).
- **Data displayed:** Full machine + provider record for the selected item.
- **User actions:** Toggle operator on/off (updates price live), tap "Book Now."
- **Button behavior:** "Book Now" navigates to Booking Confirmation carrying the full booking draft (machine, provider, request details, operator choice, computed price).
- **Navigation:** Back → Results (or Rental Browse). Book Now → Confirmation.
- **Empty/loading:** N/A (data already loaded from Results).
- **Error state:** If the slot became unavailable (simulate by disabling Book Now if mock availability changed), show "This slot was just booked — choose another" and link back to Results.
- **Success:** N/A here — success shown on next screen.
- **Mobile:** Sticky bottom bar with total price + Book Now.

## 6.6 Booking Confirmation (incl. success state)
- **Purpose:** Confirm booking details, then show success.
- **Target user:** Farmer.
- **Entry point:** "Book Now" from Service Details.
- **Layout:** Two states in one screen: (a) review state — summary of task/machine/provider/date/time/price with a "Confirm Booking" button; (b) success state — checkmark, booking ID, status "Requested," "View My Bookings" and "Back to Home" buttons.
- **Components:** Summary card, Confirm button, success icon, booking ID display.
- **Data displayed:** Full booking draft; after confirm, the created Booking record (with generated id and status).
- **User actions:** Tap "Confirm Booking" → creates the booking in mock store, screen transitions to success state.
- **Button behavior:** Confirm is a real state-mutating action (adds to the shared bookings store used by My Bookings and Provider Dashboard).
- **Navigation:** Back (review state) → Service Details. From success state → My Bookings or Home.
- **Loading state:** Brief spinner on Confirm tap.
- **Error state:** Not expected for mock data; if simulated failure needed for demo robustness, show "Something went wrong, try again" with retry.
- **Success:** As described — this screen's second state.
- **Mobile:** Same layout, full width.

## 6.7 My Bookings
- **Purpose:** List all bookings for the farmer, both service and rental.
- **Target user:** Farmer.
- **Entry point:** Nav item, or "View My Bookings" from Confirmation success state.
- **Layout:** Tabs (All / Farm Services / Rentals / Completed / Cancelled) + list of booking rows/cards.
- **Components:** Tabs, Booking Row (service/equipment name, date, location, provider, price, status badge).
- **Data displayed:** Bookings from the shared mock store, filtered by tab and farmer id.
- **User actions:** Switch tabs, tap a row → Booking Details.
- **Button behavior:** Tabs filter client-side instantly.
- **Navigation:** Row tap → Booking Details (reuses Service/Equipment Details template with status badge instead of Book button).
- **Empty state:** "No bookings yet" with a CTA back to Farm Services / Equipment Rental.
- **Loading state:** Skeleton rows on first load.
- **Error:** N/A for mock data.
- **Success:** Populated, correctly filtered list.
- **Mobile:** Tabs scroll horizontally if needed; rows stack full width.

## 6.8 Booking Details
- Reuses the Service/Equipment Details layout, adds: current status badge, status history (simple vertical stepper: Requested → Confirmed → Operator Assigned → On the Way → Work Started → Completed), and a "Cancel Booking" action if status is still Requested/Confirmed (Should-Build, not Must-Build).

---

# 7. Equipment Rental Screens

## 7.1 Equipment Rental — Browse
- **Purpose:** Entry point for farmers who already know what they need.
- **Target user:** Farmer.
- **Entry point:** "Rent Equipment" from Home or nav.
- **Layout:** Category tiles (Tractors, Harvesters, Seeders, Sprayers, Rotavators, Cultivators, Trailers, Other tools) + search bar above.
- **Components:** Category Tile, Search Bar.
- **Data displayed:** Fixed category list + counts (optional, e.g. "12 available").
- **User actions:** Tap a category → Search Results filtered by category. Type in search → Search Results filtered by query.
- **Navigation:** Category/search → Search Results.
- **Empty/loading/error:** N/A (static).
- **Mobile:** 2-column category grid.

## 7.2 Search Results + Filters
- **Purpose:** Browse/filter/sort equipment.
- **Target user:** Farmer.
- **Entry point:** From Browse.
- **Layout:** Filter bar (category, location/distance, price range, rating, availability date) + Sort dropdown + grid/list of Equipment Cards.
- **Components:** Filter Bar, Sort Dropdown, Equipment Card (image, name, provider, location, distance, price+unit, rating, availability).
- **Data displayed:** Filtered/sorted mock machine list.
- **User actions:** Apply filters, change sort, tap card → Equipment Details.
- **Button behavior:** Every filter change re-filters the list client-side immediately (no "Apply" button needed, or an explicit Apply button if filters are grouped — pick immediate filtering for a faster demo).
- **Navigation:** Card tap → Equipment Details. Back → Browse.
- **Empty state:** "No equipment matches these filters" + "Clear filters" button.
- **Loading state:** Skeleton grid on filter change (optional, can be instant since it's mock data).
- **Error:** N/A.
- **Success:** Populated filtered grid.
- **Mobile:** Filters collapse into a "Filters" button opening a bottom sheet; single-column card list.

## 7.3 Equipment Details
- Same component as Service Details (6.5) but entry differs: instead of an operator-inclusive "task match" framing, shows specifications and "suitable operations" list, plus rental-specific fields: **date + duration selector** instead of a fixed availability slot.
- **User actions:** Select rental date, select duration (days), toggle operator, see live-updating total.
- **Button behavior:** "Rent Now" → Rental Confirmation with computed total.
- **Empty/error:** If no valid dates in the visible range are available, disable Rent Now and show "No available dates this week."

## 7.4 Rental Confirmation (incl. success state)
- Same two-state pattern as 6.6, with rental-specific summary (equipment, dates, duration, operator, price breakdown: base + operator + fee = total).

Rental Booking creates a Booking record with `type: "rental"` in the same shared store used by My Bookings and Provider Dashboard.

---

# 8. Provider Dashboard

## 8.1 Overview
- **Purpose:** At-a-glance provider status.
- **Layout:** Stat cards (Total machines, Available machines, Active bookings, Upcoming bookings, Earnings this period, basic utilization %) + a short "New requests" list preview with quick Accept/Reject.
- **Data displayed:** Computed from the provider's machines + bookings in mock store.
- **User actions:** Quick Accept/Reject directly from the preview list; "View all" → Bookings tab.
- **Button behavior:** Accept/Reject immediately mutates booking status in the shared store, and Overview stats recompute.
- **Empty state:** "No bookings yet" for new-provider demo state (not needed if mock data is pre-seeded, but define it for completeness).
- **Mobile:** Stat cards stack 2-per-row then 1-per-row on narrow screens.

## 8.2 Machines
- **Purpose:** Manage machine listings and availability.
- **Layout:** Machine list/table (name, category, price, rating, availability toggle, edit button) + "Add Machine" button.
- **User actions:** Toggle availability (immediately flips `available` flag, affects whether the machine appears in farmer-side results — this is the one interaction that must visibly connect both sides of the marketplace for the demo), tap Edit → simple edit form (name, price, category — mock update only), tap Add Machine → simple add form.
- **Empty state:** "No machines listed yet — add your first machine."
- **Mobile:** Table becomes a stacked card list.

## 8.3 Bookings
- **Purpose:** Manage all incoming/ongoing bookings.
- **Layout:** Status tabs (New requests / Confirmed / Active / Completed / Cancelled) + booking rows with action buttons appropriate to status.
- **User actions:** Accept / Reject (on New requests), "Update Status" (moves a Confirmed booking forward through Operator Assigned → On the Way → Work Started → Completed).
- **Button behavior:** Every action mutates the shared booking store; the farmer's My Bookings screen reflects it (in a real app via re-fetch; in the mock prototype, both screens read the same in-memory/shared state so the change is visible if the demo re-navigates to My Bookings).
- **Empty state:** Per-tab "No bookings in this status."
- **Mobile:** Tabs scroll horizontally; rows stack.

Calendar and detailed Earnings breakdown are **Should-Build** (Section 24) — Overview's earnings stat card is enough for the Must-Build demo.

---

# 9. Component Requirements

| Component | Purpose | Inputs | Outputs/Actions | States | Reused in |
|---|---|---|---|---|---|
| Navbar | Global navigation | current route | navigate() | active-link highlight | All screens |
| Task Card | Select farm task | task label/icon | onSelect(task) | default/selected | Task Selection |
| Service/Equipment Card | Summarize a match | machine+provider data | onClick → details | default/best-match badge | Results, Rental Search |
| Search Bar | Text search | query string | onChange, onSubmit | empty/typing/has-query | Rental Browse/Search |
| Filter Bar | Narrow results | filter state | onChange → filtered list | default/applied | Rental Search |
| Sort Dropdown | Reorder results | sort key | onChange → re-sort | default/open | Results, Rental Search |
| Date Picker | Pick a date | date | onChange | default/invalid | Requirements Form, Rental |
| Time Picker | Pick a time | time | onChange | default/invalid | Requirements Form |
| Location Input | Enter/select location | text | onChange | default/invalid | Requirements Form |
| Price Summary | Show cost breakdown | base/operator/fee | — (display only) | — | Details, Confirmation |
| Rating | Show star rating | numeric rating | — | — | Cards, Details |
| Availability Badge | Show open/booked | status | — | available/unavailable | Cards, Details |
| Booking Status Badge | Show booking stage | status enum | — | 6 status values, color-coded | My Bookings, Provider Bookings |
| Operator Toggle | Add/remove operator | bool + price delta | onChange → recompute total | on/off | Details screens |
| Modal / Confirmation Dialog | Confirm destructive/important actions | content | onConfirm/onCancel | open/closed | Cancel booking, Accept/Reject |
| Toast/Notification | Confirm an action happened | message | auto-dismiss | success/error | After booking, Accept/Reject |
| Tabs | Switch views within a screen | tab list, active tab | onChange | active/inactive | My Bookings, Provider Dashboard |
| Table | Structured list (provider side) | rows/columns | row actions | default/empty | Machines list |
| Dashboard Stat Card | Show a KPI | label + value | — | — | Provider Overview |
| Empty State | No-data message | message + optional CTA | onCTAClick | — | Every list screen |

---

# 10. Functional Requirements

### FR-01 — Task Selection
The farmer must be able to select one of: Ploughing, Sowing, Spraying, Harvesting, Transport. Selecting a task and tapping Next moves to the Requirements Form. No task selected → Next stays disabled.

### FR-02 — Farm Requirements Form
The farmer must enter Crop, Area (acres, numeric > 0), Location (text), Date (today or later), Time. Form cannot submit with any field empty or invalid; inline errors identify which field.

### FR-03 — Find Services
Submitting a valid Requirements Form runs the recommendation logic (FR-08) against the mock machine dataset filtered by task suitability and returns a ranked Results list.

### FR-04 — Service Details View
Tapping a Results card opens Service Details with full machine/provider info, live-updating price if operator is toggled.

### FR-05 — Book Farm Service
Tapping Book Now on Service Details opens the Confirmation review; tapping Confirm Booking creates a Booking (`type: "service"`, `status: "Requested"`) in the shared store and shows the success state with a generated booking ID.

### FR-06 — Equipment Browse/Search/Filter
The farmer must be able to browse by category or search by keyword, then apply filters (category, price, distance, rating, availability) and sort (Recommended, Lowest price, Nearest, Highest rated). Every filter/sort change updates the visible list without a page reload.

### FR-07 — Rent Equipment
On Equipment Details, the farmer selects a rental date and duration, optionally adds an operator, sees a live total, and taps Rent Now to reach Rental Confirmation → Confirm creates a Booking (`type: "rental"`, `status: "Requested"`).

### FR-08 — Recommendation Scoring
See Section 11 — every result in Farm Service Results must carry a computed score; the highest-scoring available match is labeled "Best Match."

### FR-09 — Availability Enforcement
A machine already booked for a requested date/time must not be shown as available for that same slot in Results/Search, and its detail page must disable booking for that slot (see Section 13).

### FR-10 — My Bookings
The farmer must see all their bookings, filterable by tab (All/Farm Services/Rentals/Completed/Cancelled), each showing current status; tapping a booking opens its details with a status history stepper.

### FR-11 — Provider Machines Management
A provider must be able to view all their machines, add a new machine (name, category, price, pricing unit), edit an existing one, and toggle availability on/off. Toggling availability off must immediately remove that machine from farmer-facing results.

### FR-12 — Provider Booking Actions
A provider must be able to see New requests and Accept or Reject each; an accepted booking must be movable through Confirmed → Operator Assigned → On the Way → Work Started → Completed via an explicit "Update Status" action.

### FR-13 — Shared Booking Store Consistency
Any booking created on the farmer side must be visible on the provider side (and vice versa for status changes) — both sides must read from the same in-memory/mock data store, not disconnected local state per screen.

---

# 11. Recommendation Logic

Inputs per candidate machine: task match, crop suitability, distance (km), availability for the requested date/time, rating.

```
score =
    (task_match ? 40 : 0) +
    (crop_suitability_match ? 15 : 0) +
    max(0, 20 - distanceKm * 2) +
    (availability_match ? 15 : 0) +
    (rating / 5 * 10)
```

- Only machines with `task_match = true` and `availability_match = true` are eligible for the ranked list (a machine that can't do the job or isn't free shouldn't appear as a recommendation at all).
- Sort eligible machines by `score` descending.
- The top result is labeled **"Best Match."**
- If zero machines are eligible: relax the crop-suitability requirement first (show task-capable machines regardless of crop, marked "Partial match") before showing a true empty state. If still zero, show the Results empty state (6.4) with a CTA to Equipment Rental.
- This is deterministic rule-based scoring — the demo narration should explicitly say so, not imply machine learning.

---

# 12. Pricing Logic

**Farm Service:** `price = pricePerAcre × areaAcres` (use `pricePerUnit`/`pricingUnit` from the Machine record; some machines may be priced per hour instead — apply accordingly).

**Rental:** `price = ratePerUnit × duration` (per day or per hour depending on `pricingUnit`).

**Both, if operator selected:** add a flat `operatorFee` (mock value, e.g. ₹500/day).

**Display breakdown on Details and Confirmation:**
```
Base Price:      ₹X
Operator Fee:    ₹Y (if selected)
Service Fee:     ₹Z (flat demo fee, e.g. ₹100)
-----------------------------
Total:           ₹(X+Y+Z)
```
Use clearly-labeled mock values throughout; never imply these are live market rates (per strategy doc).

---

# 13. Availability Logic

- Each Machine has an `availability` list of `{date, timeSlots}` (Farm Service) or is simply marked available/unavailable for a date range (Rental).
- A machine is **unavailable** for a slot if an existing non-cancelled Booking already occupies that machine + date/time.
- When a Booking is created, the matching availability slot is marked booked (mutate the mock store) so subsequent searches correctly exclude it.
- An unavailable machine must not appear as a Best Match / eligible recommendation (FR-09) — it may optionally appear grayed-out in Search Results with an "Unavailable for selected date" note, but should not be bookable.
- Provider toggling a machine fully "unavailable" (Section 8.2) removes it from all farmer-facing results regardless of date.

---

# 14. Booking Logic

- **Create booking:** generates a unique `id` (e.g. incrementing mock counter or UUID), sets `status: "Requested"`, stores full snapshot of price/date/machine/provider/operator choice.
- **Booking status enum:** `Requested → Confirmed → OperatorAssigned → OnTheWay → WorkStarted → Completed`, plus a separate `Cancelled` state reachable from `Requested` or `Confirmed`.
- **Confirmation:** Provider's Accept action moves `Requested → Confirmed`. Reject moves it to `Cancelled` (with a reason field, optional).
- **Status progression:** Provider's "Update Status" advances one stage at a time in the defined order; the UI should not allow skipping stages in the MVP (keeps the demo predictable).
- **Cancellation (farmer side, Should-Build):** allowed only while status is `Requested` or `Confirmed`.
- **My Bookings update:** reads live from the shared store — no separate "refresh" step should be required in the mock prototype (same in-memory state).
- All of the above use local/mock state (e.g. React context or a simple store) — no backend/API calls required for the hackathon build.

---

# 15. Data Model

| Entity | Field | Type | Required | Example | Notes |
|---|---|---|---|---|---|
| **Farmer** | id | string | yes | "f1" | |
| | name | string | yes | "Ramesh Kumar" | |
| | location | string | yes | "Lucknow, UP" | |
| | phone | string | no | "9876500000" | mock only |
| **Provider** | id | string | yes | "p1" | |
| | name | string | yes | "Singh Agro Services" | |
| | location | string | yes | "Lucknow, UP" | |
| | rating | number | yes | 4.7 | 0–5 |
| | machines | Machine[] | yes | — | relationship |
| **Machine** | id | string | yes | "m1" | |
| | name | string | yes | "Combine Harvester" | |
| | category | string | yes | "Harvester" | matches rental categories |
| | providerId | string | yes | "p1" | FK → Provider |
| | suitableFor | string[] | yes | ["Harvesting"] | task types |
| | suitableCrops | string[] | yes | ["Wheat","Paddy"] | for crop-match scoring |
| | location | string | yes | "Lucknow, UP" | |
| | distanceKm | number | yes | 3.2 | mock, static per request |
| | pricePerUnit | number | yes | 900 | |
| | pricingUnit | enum | yes | "per acre" | "per acre"\|"per hour"\|"per day" |
| | rating | number | yes | 4.7 | |
| | availability | {date, timeSlots}[] | yes | — | mutated on booking |
| | operatorAvailable | boolean | yes | true | |
| | available | boolean | yes | true | provider-side master toggle |
| **FarmServiceRequest** | id | string | yes | "r1" | |
| | farmerId | string | yes | "f1" | FK |
| | task | string | yes | "Harvesting" | |
| | crop | string | yes | "Wheat" | |
| | areaAcres | number | yes | 5 | |
| | location | string | yes | "Lucknow" | |
| | date | string | yes | "2026-08-22" | |
| | time | string | yes | "08:00" | |
| **Booking** | id | string | yes | "b1" | |
| | type | enum | yes | "service" | "service" \| "rental" |
| | farmerId | string | yes | "f1" | FK |
| | providerId | string | yes | "p1" | FK |
| | machineId | string | yes | "m1" | FK |
| | date | string | yes | "2026-08-22" | |
| | durationOrTime | string | yes | "08:00" or "3 days" | context-dependent |
| | operatorSelected | boolean | yes | true | |
| | totalPrice | number | yes | 4500 | |
| | status | enum | yes | "Requested" | see Section 14 |

---

# 16. UI/UX Requirements

Do not build a generic AI-glow landing page. Avoid neon, heavy gradients, glassmorphism, floating glowing cards, fake dashboards, decorative buttons, or giant empty hero sections. FarmSeva should read as a real, launchable agricultural marketplace — closer in tone to TRRINGO/JFarm Services than to a SaaS concept page.

Use: light/neutral backgrounds, professional typography, practical cards, clear icons, realistic agricultural imagery, subtle agricultural visual identity (earth tones/greens used sparingly, not as a gimmick), tables where useful (provider Machines list), forms, status badges, search, filters, tabs. Large touch targets and minimal-step forms throughout, since the primary user may not be comfortable with complex digital interfaces.

Use competitor research for inspiration on layout patterns only — do not copy any specific product's design.

---

# 17. Interaction Requirements

Most visible buttons must work — no decorative buttons. Defined behaviors:

| Action | Result |
|---|---|
| Filter change | Results list updates immediately |
| Sort change | Results reorder immediately |
| Task card tap | Selection highlighted, Next enabled |
| Find Services | Runs recommendation logic, navigates to Results |
| Tab click | Correct filtered content renders |
| Operator toggle | Price recalculates live |
| Book Now / Rent Now | Navigates to Confirmation with full draft |
| Confirm Booking | Creates booking in shared store, shows success state |
| Provider Accept | Booking status → Confirmed, disappears from "New requests" |
| Provider Reject | Booking status → Cancelled |
| Update Status | Booking advances one stage |
| Mark machine unavailable | Machine disappears from farmer-facing results |
| Add/Edit machine | Machine list updates immediately |

Everything above uses local/mock state — no real backend required.

---

# 18. Responsive Requirements

- **Desktop:** full nav bar, multi-column card grids (Results, Rental Search), side-by-side filter bar + results, provider tables shown as tables.
- **Tablet:** 2-column card grids, filters may collapse into a toggleable panel.
- **Mobile:** hamburger nav, single-column card stacks, sticky bottom price/CTA bar on Details screens, filters in a bottom sheet, provider tables become stacked cards, tabs scroll horizontally where there are more than 3.

Do not simply shrink the desktop layout — each of the above is a genuine layout change, not a CSS scale-down.

---

# 19. Error / Empty / Loading States

| Screen | Empty | Loading | Error |
|---|---|---|---|
| Service Results | "No matches — showing partial matches" / true empty with CTA to Rental | Skeleton cards, brief mock delay | N/A (mock data) |
| Rental Search | "No equipment matches these filters" + Clear filters | Skeleton grid (optional) | N/A |
| My Bookings | "No bookings yet" + CTA | Skeleton rows | N/A |
| Provider Bookings (per tab) | "No bookings in this status" | Skeleton rows | N/A |
| Provider Machines | "No machines listed yet — add your first" | Skeleton rows | N/A |
| Any booking action | — | Brief spinner on button | Simulated failure (Should-Build): toast "Something went wrong, try again" |
| Service/Equipment Details | Slot became unavailable → disable Book/Rent, message + link back | N/A | Same as above |

No blank/dead screens anywhere in the Must-Build set.

---

# 20. Mock Data

**Location:** Lucknow, Uttar Pradesh (all demo distances/providers centered here).

**Crops:** Wheat, Paddy, Potato, Sugarcane.

**Machines (minimum set to demonstrate search/filter/recommendation/availability):**
- Mahindra Tractor (Ploughing, Sowing, Transport) — 2–3 listings from different providers, different prices/distances/ratings
- Swaraj Tractor (Ploughing, Transport)
- Combine Harvester (Harvesting — wheat/paddy) — at least 2, one closer/pricier, one farther/cheaper, to make "Best Match" meaningful
- Seed Drill (Sowing)
- Rotavator (Ploughing) — used in the demo rental flow
- Sprayer (Spraying)
- Cultivator (Ploughing)

**Providers:** 4–5 mock providers with names, ratings (4.2–4.9 range), Lucknow-area locations, each owning 1–3 machines above.

Enough combinations so that: the wheat-harvesting demo query returns a clear Best Match plus 1–2 alternatives; the rotavator rental search returns 2+ results to filter/sort; and the provider dashboard has at least 3 bookings pre-seeded across different statuses (one Requested, one Confirmed/in-progress, one Completed) so Overview and Bookings tabs aren't empty on first load.

Never label mock data as live.

---

# 21. Demo Flow (2–3 min)

1. **Home** → "Book Farm Service"
2. **Task Selection** → Harvesting
3. **Requirements** → Wheat, 5 acres, Lucknow, tomorrow, 8:00 AM → Find Services
4. **Results** → Best Match badge on Combine Harvester + Operator, 3.2 km, ₹900/acre, ★4.7 → tap card
5. **Service Details** → operator already included, shows total → Book Now
6. **Confirmation** → Confirm Booking → success state with booking ID
7. Quick cut: **Equipment Rental** → search "Rotavator" → pick a result → **Equipment Details** → select date/duration → toggle operator → total updates → Rent Now → Confirm
8. **Provider Dashboard** → Overview shows the new request → Bookings tab → Accept → status becomes Confirmed → Update Status once more to show the flow → back to **My Bookings** to show the farmer-side status reflecting the change

---

# 22. Business Requirements

- **Primary revenue:** commission on completed Farm Service bookings.
- **Secondary revenue:** commission on Equipment Rentals.
- **Farmer value:** one place to describe work and get matched, transparent pricing, less dependence on phone calls/personal contacts.
- **Provider value:** centralized bookings, better machine utilization, visibility beyond word-of-mouth.
- **Marketplace value:** two-sided loop demonstrated end-to-end in the prototype (farmer books → provider acts → status visible to both).

No additional monetization features (ads, featured listings, subscriptions) should be built into this MVP — they're Future scope only.

---

# 23. Trust & Security

Lightweight for the prototype — do not build these, just be aware they're absent:
- No real authentication (a simple "logged in as Farmer / logged in as Provider" role switch is enough, Should-Build)
- No payment protection (payments aren't in scope at all)
- No provider verification, deposits, or dispute handling

**Future (not MVP):** provider verification, ratings-driven trust score, machine condition photos at handover, security deposits, formal cancellation policy, in-app dispute flow, escrow-style payment protection once payments exist.

---

# 24. Scope Control

### MUST BUILD
- Home
- Farm Service: Task Selection → Requirements → Results → Details → Confirmation (+success)
- Equipment Rental: Browse → Search/Filter → Details → Confirmation (+success)
- My Bookings (list + details, tab filtering)
- Provider Dashboard: Overview, Machines (with availability toggle), Bookings (accept/reject/update status)
- Shared mock booking store connecting farmer and provider sides
- Recommendation scoring (Section 11)
- Responsive layout (desktop/tablet/mobile)

### SHOULD BUILD (if time remains)
- Explicit filter chips on Service Results (not just Rental Search)
- Farmer-side booking cancellation
- Simple role switch UI (Farmer/Provider) instead of two separate URLs
- Add/Edit machine forms fully wired (vs. static demo data only)
- Toasts for every state-changing action

### FUTURE (do not build now)
- Real authentication, payments, maps/geolocation, real messaging, Calendar tab, detailed Earnings breakdown, multi-language, voice/IVR booking, worker marketplace, ML-based recommendations, disease/weather features, dispute handling.

Target: **6–8 fully functional screens**, not 20 decorative ones — this PRD's Must-Build list maps to exactly that (Home, Farm Service flow as one connected screen group, Rental flow as one connected screen group, My Bookings, Provider Dashboard).

---

# 25. Technical Prototype Specification

- **Frontend:** React (function components + hooks). No SSR/framework overhead needed for a 3-hour build — plain React + client-side routing is enough.
- **Routing:** Client-side router (React Router or equivalent) with routes matching the IA in Section 4.
- **State management:** A single mock data store (React Context + `useReducer`, or a simple shared module with in-memory arrays) holding `farmers`, `providers`, `machines`, `bookings`. All screens read/write through this one store so farmer-side and provider-side stay in sync (FR-13).
- **Mock data approach:** A seed file (`mockData.js`) populates the store on load per Section 20.
- **Local persistence:** Not required for the hackathon demo (in-memory is fine and resets on refresh, which is acceptable); if time allows, `localStorage` sync is Should-Build only.
- **Component structure:** Shared reusable components per Section 9, kept in a `components/` folder; screen-level components in a `screens/` or `pages/` folder; the Details screen component should be genuinely shared between Farm Service and Rental flows (parameterized by data + mode), not duplicated.
- **Responsive approach:** CSS utility classes or a lightweight framework (e.g. Tailwind) with the breakpoint behaviors defined in Section 18 — do not hand-roll a separate mobile app.
- **Do not over-engineer:** no server, no database, no auth provider, no design system beyond what's needed to look clean and consistent.

---

# 26. Acceptance Criteria

**Farm Service Booking**
Given a farmer enters a valid task, crop, area, location, date, and time:
- Matching, available services are displayed, ranked by score.
- The top eligible result is labeled Best Match.
- The farmer can open a result's details.
- The farmer can toggle an operator and see the price update.
- The farmer can book, and a Booking record is created with status Requested.
- The booking appears in My Bookings.
- The booking appears in the Provider's New Requests.
- The provider can accept it, and its status becomes Confirmed everywhere it's shown.

**Equipment Rental**
Given a farmer searches/filters/sorts equipment:
- The visible list updates correctly for every filter/sort change.
- Opening details and selecting date/duration/operator produces a correct live total.
- Renting creates a Booking (`type: "rental"`) visible in My Bookings and the Provider dashboard.

**Operator Selection**
- Toggling the operator on any Details screen changes the displayed total by exactly the operator fee, in both directions (on→off and off→on).

**Provider Dashboard**
- Overview stats are computed correctly from the current machines/bookings state (not hardcoded).
- Accept/Reject on a New Request updates that booking's status and moves it out of the New Requests list.
- Update Status advances a booking exactly one stage per click, in the fixed order.
- Toggling a machine's availability off removes it from farmer-facing Results/Search immediately.

**My Bookings**
- Tab filters show exactly the bookings matching that tab's criteria (type or status).
- Opening a booking's details shows an accurate status stepper matching its current status.

**Search/Filter**
- Every filter and sort control changes the visible list correctly and instantly, with no stale results.

**Availability**
- A machine already booked for the exact requested date/time does not appear as an eligible recommendation for a conflicting request.

---

# 27. Final PRD Quality Check

- Every Must-Build feature above has a functional requirement (Section 10) and acceptance criteria (Section 26). ✓
- Every interactive button has defined behavior (Section 17). ✓
- User flows are complete and connected end-to-end (Sections 6–8, 21). ✓
- Screens connect via clearly defined navigation on every screen doc. ✓
- Scope is realistic for 3 hours per Section 24's Must-Build list (8 connected screen groups, all mock/local state, no backend). ✓
- Machinery remains the main focus; Farm Service is primary, Rental secondary, operator strictly optional (Sections 1–3, 6, 7). ✓
- Task-first USP is preserved as the literal first two screens of the main flow. ✓
- UI direction is explicitly non-generic/non-AI-glow (Section 16). ✓
- Removed features (payments, maps, auth, i18n, worker marketplace, ML, disease/weather) are explicitly listed as Future, not silently dropped. ✓
- An AI coding agent has: IA, screen-by-screen behavior, component table, functional requirements, data model with types, pricing/availability/booking logic, mock dataset spec, and acceptance criteria — enough to build without asking clarifying questions on any Must-Build item.

This PRD is ready to hand to a coding agent for Phase 3 (build).
