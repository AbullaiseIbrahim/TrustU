# TrustU — Full App Flow (from Figma/prototype HTML)

Source: `TrustU.html` prototype (single-file state machine — `view`, `tab`, and per-section sub-states like `flatmateView`, `hostelView`, `exploreTab`). This document maps every screen the prototype defines, in the order a user actually moves through them, plus what each screen shows and what's wired up (has an `onClick` handler) vs. what's decorative.

---

## 1. Top-level flow

```
Welcome/Login → (Register) → Profile Setup (Step 1) → Community Join (Step 2)
      → MAIN APP
            ├─ Community (Feed / Members / Friends / Mutual Friends / Requests)
            ├─ Explore (accommodation search & listing)
            ├─ Post (+ button → Ask Community | List Accommodation | Offer a Service*)
            └─ Profile (view/edit own profile, my listings, sign out)
      → Sign Out → back to Welcome/Login
```
*"Offer a Service" has no click handler in the prototype — it's a placeholder, not wired to anything.

---

## 2. Auth

### Welcome screen (`view: welcome`)
Shows: status bar mock, TrustU brand mark, hero card ("Trusted relocation — Settle into your new city, together"), tagline "Kerala · Jamia Nagar community".
Actions: **Continue with Google** (`onGoogle`), **Continue with email** (reveals email login form), **Log in** link, Terms of Service / Privacy Policy links (static).

### Email login (same screen, expanded)
Fields: Email, Password. Error message slot. Links: "Forgot password?" (no handler — decorative), "Create account".
Action: **Log in** (`onLogin`) → on success goes to `feed` if profile already complete, otherwise `setupProfile`.

---

## 3. Onboarding (first-time users only)

### Step 1 — Save your profile (`view: setupProfile`)
Shows: avatar initials, name, designation (auto-filled from signup), two location pickers:
- **Permanent State**: State dropdown (Kerala) → District dropdown (all 14 Kerala districts)
- **Current State**: State (Delhi) → Area (Jamia Nagar)

Action: **Save & Continue** (`onSaveSetup`) → advances to Step 2.

### Step 2 — Communities you belong to (`view: communities`)
Shows: auto-matched community card "Kerala-Jamia Nagar" with member/friend/mutual counts (1248 Members · 300 Friends · 400 Mutual Friends), a **Join** toggle, and a link to **Explore Communities** (other Kerala communities across Delhi — most marked "Coming soon").

Actions: **Join** (`onJoinCommunity`) → enters main app. **Explore Communities** (`onExploreCommunities`) → sub-screen listing more communities; tapping an unavailable one opens a "Coming soon" modal (`onCloseComingSoon` to dismiss).

---

## 4. Main app shell

Every main-app screen shares:
- **App header**: TrustU logo, a **Community/Network toggle pill** (`onToggleNetwork` — switches the whole app between "Kerala-Jamia Nagar" sub-community view and the broader "Network" view, described as "Amalgam of 5+ Kerala communities"), notification bell.
- **Bottom nav** (5 items): Community (home), Explore (`onExplore`), central **+** post button (`onOpenPost`), **Messages** (icon only — **no handler wired**, non-functional placeholder), Profile (`onProfile`).

---

## 5. Community tab (`tab: Feed | Members | Friends | Mutual Friends | Requests`)

### Community banner (always visible above tabs)
Community name, member count, friends/mutuals count line, "Amalgam of 5+ Kerala communities" subtitle (network mode).

### Feed tab
Shows: composer pill (avatar + "Post" placeholder, `onOpenPost`/`onComposerChange`), list of post cards (avatar, name, meta line, relationship label e.g. "Mutual Friend", post body, Like/Comment/Upvote counts).
Actions per post: **Like** (`onLike`), **Upvote** (`onUpvote`), **Comment** (`onComment` → opens comment box, `onCommentInput`, `onAddComment`). If it's your own post: **⋯ menu** (`onMenu`) → Edit (`onEdit`, `onEditDraftChange`, `onSaveEdit`, `onCancelEdit`) / Delete (`onDelete`).

### Members tab
Shows: full community member list — avatar, name, meta (designation/institution), relationship label.
Actions: **Add Friend** (`onAddFriend`) → button becomes "Request Sent"; tapping a member opens their profile (`onOpen`/viewingUser).

### Friends tab
Shows: your friends list with search (`onFriendsQuery`), "See all" (`onFriendsAll`).
Actions: **Remove friend** (`onRemove`).

### Mutual Friends tab
Shows: mutual-friends list with search (`onMutualsQuery`), "See all" (`onMutualsAll`).
Actions: **Delete/remove mutual** (`onDeleteMutual`).

### Requests tab
Shows: incoming friend requests — name, mutual-friends text.
Actions: **Confirm** (`onConfirm`), **Delete** (`onDelete`). Empty state: "No pending requests."

---

## 6. Explore tab (`view: explore`)

### Explore main
Shows: community header, "What are you looking for?" heading, 5 category cards: Flatmate Needs, Short Stays, Flats for Rent, Hostels, Hotels. Search icon (`onOpenSearch`).

Each category has its **own 3-screen sub-flow**, all following the same pattern:

**a) Category browse** (e.g. `flatmateView: browse`) — community stats header, filter pills (All/Friends/Mutual/Community), horizontally-scrolling sub-groups (e.g. by gender), each with a **→ arrow** (`onDetails`/see-all) opening the full list.

**b) Full list** (`...View: browse`) — vertical list of all items in that sub-group as horizontal cards (photo + title + type chip + price + connection badge).

**c) Filters modal** (`onOpenFilters` / per-category variants: `onOpenSSFilters`, `onOpenFlatRentFilters`, `onOpenHostelFilters`, `onOpenHotelFilters`) — budget range, gender, dropdowns (roommate prefs, locality, dates, occupancy, etc. — fields vary by category), amenities chips, **Apply** (`onApplyFilters` family) / **Clear** (`onClearFilters` family).

**d) Listing detail** — hero photo, title, price, availability, star rating/reviews, "Posted By" card (avatar, name, mutual-friends line, "View Poster" → `onViewPoster` opens that user's profile), Amenities grid, sticky footer **Contact via WhatsApp** button (`onContactWhatsapp` / `onContactHostelWhatsapp` / `onContactHotelWhatsapp`).

Category-specific fields:
| Category | Extra fields in detail/filters |
|---|---|
| Flatmate Needs | Gender, roommate preference, current roommates |
| Short Stays | Guest preference, dates needed, people allowed |
| Flats for Rent | Flat type (BHK), security deposit, floor, furnishing, ventilation/electricity/water |
| Hostels | Inmates preference (Girls/Boys), occupancy type, room features |
| Hotels | Checkin/checkout time, star rating, nearby landmark |

---

## 7. Post creation (+ button, `showPostSheet`)

### Post action sheet
Two working options + one placeholder:
- **Ask Community** (`onAskCommunity`) — closes sheet, opens the Feed composer.
- **List Accommodation** (`onListAccommodation`) — opens the multi-step listing form.
- **Offer a Service** — *no onclick handler in the prototype; visually present but non-functional.*

### List Accommodation form
Step fields common to all types: Type of Stay selector (5 chip options), then type-specific fields (see table above) revealed conditionally, plus a shared "View More" expandable section (roommate/guest/occupancy prefs, deposit, dates, locality, **Visible To** — Friends / Mutual Friends / Friends & Mutual Friends / Anyone), Rent/Price fields, Amenities chip picker, Photos upload row.

Action: proceeds to **Review Post** screen.

### Review Post (preview before publishing)
Shows the listing exactly as it will appear in Explore (hero, title, price, poster card, amenities). Actions: **Edit** (`onBackToForm`), **Delete/discard** (`onDelete`), **Post** (`onSubmitAccommodation`) → publishes and returns to Explore/category view.

---

## 8. Profile tab (`view: profile`)

### My Profile
Shows: **Sign Out** button (top-right), avatar initials, name, Friends/Mutuals counts, "350 Friends with things in Common" line, Personal Details card (gender, permanent state/district, current state/area, designation, institution) with **Edit** link, **My Listings** section (your posted accommodations with Edit/Delete per item), Friends section preview + "See all", Mutual Friends section preview + "See all".

### Edit Profile (`view: editProfile`)
Fields: Avatar (with Edit affordance — no upload handler wired, i.e. photo upload is not implemented in this prototype), First Name, Last Name, Email (marked "Not visible to other users"), Phone ("Partially visible to other users"), Gender, Permanent State + District, Current State + Area, Designation, Institution.
Action: **Save Profile** (`onSaveProfile`).

### Other user's profile (`view: userProfile`, reached from Members/post author/poster taps)
Shows: their avatar/name, relationship text, Friends/Mutuals counts, **Add Friend / Request Sent** button, Personal Details (read-only), link to **their listings** (`onOpenListings` → `view: userListings`).

### My Listings / friends "See all" lists
`friendsList` and `mutualsList` views — full scrollable list versions of the Friends/Mutual Friends previews shown on the profile.

---

## 9. Sign out

`onSignOut` — resets all session state (email, password, tab, filters, etc.) and returns straight to the **Welcome/Login** screen. No confirmation dialog in the prototype.

---

## 10. Confirmed non-functional / placeholder elements

These appear visually in the design but have **no click handler** in the prototype's state machine — worth flagging before scoping backend work for them:

- **Messages** bottom-nav icon — no handler at all.
- **Offer a Service** post-sheet option — no handler at all.
- **"Forgot password?"** link on login — no handler.
- **Profile photo upload** ("Edit" on avatar, both on My Profile and Edit Profile) — no upload handler; avatar is initials-only throughout.
- Most communities under "Explore Communities" — hardcoded "Coming soon" modal, not real join flow.
