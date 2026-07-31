# Product: WPU Cafe

WPU Cafe is a single-page POS (point-of-sale) frontend for cafe staff. It allows authenticated staff members to manage customer orders.

## Core User Flows

1. Staff opens the app, lands on Home, and navigates to Login.
2. After login with email/password, staff is redirected to the order list.
3. From the order list, staff can:
   - Create a new order (select menu items, fill in customer info)
   - View the detail of any order
   - Mark a "PROCESSING" order as "COMPLETED"
   - Logout
4. Creating an order involves picking items from a filterable menu and submitting with customer name and table number.

## Pages

| Route | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/login` | Login | Public (redirects to `/orders` if already logged in) |
| `/orders` | ListOrder | Protected |
| `/orders/:id` | DetailOrder | Protected |
| `/create` | CreateOrder | Protected |

## Backend API

The app connects to a hosted REST API: `https://wpu-cafe.vercel.app/api` (configured via `VITE_API_URL` in `.env.local`). Authentication uses JWT tokens stored in `localStorage` under the key `"auth"`.
