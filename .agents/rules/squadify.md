---
trigger: always_on
---

# Squadfish Frontend Rules

Build a production-ready React frontend for Squadfish using the backend API documented in this project.

## Tech Stack

Use only:

* React + TypeScript
* Vite
* React Router
* TanStack Query (React Query)
* Axios
* Firebase Authentication
* React Hook Form
* Zod
* Tailwind CSS
* shadcn/ui

Do NOT use:

* Redux
* MobX
* Material UI
* Bootstrap
* jQuery
* fetch() for API calls

---

## Architecture

Use this structure:

src/
├── api/
├── auth/
├── components/
├── hooks/
├── pages/
├── routes/
├── types/
├── lib/
└── App.tsx

Separate:

* UI components
* API layer
* React Query hooks
* Pages
* Authentication

---

## Authentication

Authentication uses Firebase Google Sign-In.

Flow:

Firebase Login
→ Get Firebase ID Token
→ POST /api/auth/me
→ Create/Update MongoDB User
→ Redirect to Dashboard

Always call POST /api/auth/me after successful Firebase login.

All API requests must send:

Authorization: Bearer <firebase_id_token>

using a single shared Axios instance with request interceptors.

Never store user information in localStorage except what Firebase manages.

Use Firebase Auth as the source of truth.

---

## Routing

Routes:

/
→ Dashboard

/login
→ Login

/trips/new
→ Create Trip

/trips/:tripId
→ Trip Details

/trips/:tripId/participants
→ Participants

/trips/:tripId/expenses
→ Expenses

/invitations
→ Pending Invitations

/profile
→ User Profile

All routes except /login must be protected.

---

## State Management

Use React Query for ALL server state.

Examples:

["trips"]
["trip", tripId]
["participants", tripId]
["expenses", tripId]
["pendingInvitations"]

Do not store API data in Context.

Context should only be used for authentication.

---

## Forms

All forms must use:

* React Hook Form
* Zod validation

Examples:

* Create Trip
* Invite Participant
* Create Expense
* Update Trip

No manual form validation.

---

## UI Requirements

Mobile-first design.

Primary screens:

1. Login
2. Dashboard
3. Create Trip
4. Trip Details
5. Participants
6. Expenses
7. Invitations
8. Profile

Every page must have:

* Loading state
* Empty state
* Error state
* Success state

Never show blank screens.

Use cards instead of large tables whenever possible.

---

## Authorization Rules

Frontend should hide actions based on role:

Admin:

* Edit Trip
* Delete Trip
* Invite Participant
* Remove Participant

Participant:

* View Trip
* View Participants
* View Expenses
* Add Expenses

Backend remains the source of truth for authorization.

---

## API Rules

Use the backend contract exactly as documented.

Never hardcode data.

Never assume IDs.

Always use API responses as the source of truth.

After mutations, invalidate relevant React Query caches.

Examples:

Create Trip
→ invalidate ["trips"]

Accept Invitation
→ invalidate ["pendingInvitations"]
→ invalidate ["trips"]

Invite Participant
→ invalidate ["participants", tripId]

---

## Business Rules

A user can only see trips returned by GET /api/trips.

Never cache trip membership separately.

Never expose trips not returned by the backend.

A trip creator becomes Admin automatically.

Invited users can access a trip only after accepting the invitation.

All trip, participant, expense, and balance data must come from authenticated API calls.

Build reusable, scalable, production-quality components and keep business logic in hooks/services, not inside UI components.