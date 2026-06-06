# Squadfish

Squadfish is a modern trip expense-sharing application designed to help you split costs effortlessly with your friends.

## Features

- **Secure Authentication:** Seamless login via Google using Firebase Authentication.
- **Trip Management:** Create trips, manage details, and invite participants.
- **Expense Tracking:** Add, view, and manage shared expenses within a trip.
- **Role-Based Access Control:** Trip creators become admins with the ability to manage participants and delete trips.
- **Settlement Summaries:** Instantly see who owes what and keep track of balances.
- **Modern UI:** Built with Tailwind CSS and shadcn/ui, featuring a premium responsive design with dark mode support.

## Tech Stack

- **Framework:** React + TypeScript (Vite)
- **State & Data Fetching:** TanStack Query (React Query)
- **Routing:** React Router
- **Styling:** Tailwind CSS + shadcn/ui
- **Forms & Validation:** React Hook Form + Zod
- **Authentication:** Firebase Auth
- **API Client:** Axios

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Firebase project with Google Authentication enabled
- The Squadfish Backend running locally or deployed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ayaskantsid/squadfish-web.git
   cd squadfish-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` or `.env.development` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

This application is configured for seamless deployment on [Vercel](https://vercel.com). Simply import the repository, select the Vite framework preset, and add your environment variables.
