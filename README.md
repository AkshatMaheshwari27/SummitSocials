# Summit Socials

> Connecting builders, shipping tomorrow's tech.

**Live demo:** https://summit-socials.vercel.app/

---

## Overview

Summit Socials is a full-stack event platform built around a single flagship
workshop, **Prompt to Product**. It covers the whole attendee journey —
discovering the event, signing in, registering, paying, and tracking status on a
personal dashboard — alongside a protected area where an organiser reviews
registrations.

The application is a realistic implementation of a paid-event flow: OAuth
authentication, a server-validated registration, a Stripe Checkout payment in
**Test Mode**, a signature-verified webhook that is the single source of truth
for payment status, an automated confirmation email, and role-based access to
the admin surface.

---

## Key Features

- **Google OAuth login** and **GitHub OAuth login** via Auth.js (no passwords).
- **Secure authenticated registration** — the registration form is validated on
  the client for UX and again on the server as the real boundary.
- **Paid workshop registration** with the price resolved server-side from the
  database (the browser never supplies an amount).
- **Stripe Checkout in Test Mode** — Checkout Sessions are created server-side.
- **Webhook-based payment confirmation** — a Stripe webhook verifies the event
  signature and idempotently marks the registration and payment as paid;
  reaching the success page is never treated as proof of payment.
- **Automated confirmation email** via Resend, sent once after a verified
  payment (idempotent across webhook retries).
- **User dashboard** showing the current registration, payment status, a
  reference code, and an "add to calendar" file.
- **Admin-only registered-user management** — an overview with seat and revenue
  figures plus a searchable, filterable registrations table.
- **Responsive, editorial frontend** designed from ~360px up to wide desktop.
- **Accessibility support** — semantic landmarks, keyboard navigation, visible
  focus states, labelled form errors, and WCAG AA text contrast.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js (App Router) |
| UI | React, TypeScript |
| Runtime | Node.js |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 6.19.3 |
| Auth | Auth.js with Google OAuth and GitHub OAuth |
| Payments | Stripe (Test Mode) |
| Email | Resend |
| Hosting | Vercel |

---

## How It Works

```
User
  → OAuth sign-in (Google or GitHub)
  → Workshop registration (authenticated, server-validated)
  → Stripe Checkout (Test Mode)
  → Stripe webhook (signature-verified, idempotent)
  → Registration and payment marked confirmed
  → Resend confirmation email (sent once)
  → User dashboard
```

Payment state changes only when the verified webhook processes the event. The
webhook reads the raw request body, checks the Stripe signature, resolves the
associated registration, and applies the update safely so duplicate or retried
deliveries do not double-charge, double-register, or send a second email.

---

## Admin & Security

- **Role assignment** is controlled server-side through the `ADMIN_EMAILS`
  allowlist. An account whose verified email is on that list is promoted to the
  `ADMIN` role on sign-in; roles are never set from anything the client sends.
- **Admin data access is gated on the server.** Every admin query runs behind an
  authorization check — a signed-in non-admin receives a 404, and an anonymous
  visitor is redirected to sign in. Hiding navigation links is not relied on as
  a security measure.
- **Server-controlled pricing** — the charged amount is read from the workshop
  record on the server.
- **Webhook signature verification** against the raw body, with idempotent
  payment handling.
- **Duplicate registrations** are prevented by a database constraint.

---

## Design & UX

The interface follows an editorial direction rather than a generic dashboard
template: a serif display face paired with a technical sans and monospace for
metadata, a cool-paper palette with a single accent colour, hairline rules, and
generous whitespace with a clear type hierarchy.

- Server-first rendering with the Next.js App Router; client components are used
  only where interaction requires them.
- Responsive layouts from small mobile widths up to wide desktop.
- Restrained motion that respects `prefers-reduced-motion` and leaves all
  content visible without JavaScript.
- Accessibility: one `h1` per page, semantic `header` / `nav` / `main` /
  `footer` landmarks, a visible keyboard focus ring, form fields with associated
  labels and accessible error messages, and status communicated with text and an
  icon rather than colour alone.

---

## Project Structure

```
app/          Routes (App Router pages) and API route handlers
components/   UI primitives and feature components
              (ui, navigation, workshop, registration, checkout, admin, success)
lib/          Server logic — Auth.js config, Prisma client, Stripe, Resend email,
              permission helpers, domain helpers, and input validation
prisma/       Prisma schema, migrations, and the database seed script
public/       Static assets
types/        TypeScript module augmentation (Auth.js session and user types)
```

---

## Local Setup

```bash
# 1. Install dependencies (also runs `prisma generate`)
npm install

# 2. Create your environment file and fill in your own values
cp .env.example .env

# 3. Apply the database schema
npm run db:migrate        # local development (prisma migrate dev)

# 4. Seed the workshop record
npm run db:seed

# 5. Start the development server
npm run dev               # http://localhost:3000
```

For local payment testing, use the Stripe CLI to forward test-mode events to
`/api/stripe/webhook` and copy the signing secret it prints into your
environment file.

---

## Environment Variables

Configure these in `.env` for local development and in the hosting provider for
deployment. Names only — no values are committed. See `.env.example` for the
template.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Pooled PostgreSQL connection used at runtime |
| `DIRECT_URL` | Direct PostgreSQL connection used for migrations |
| `AUTH_SECRET` | Auth.js session/token signing secret |
| `AUTH_URL` | Canonical application URL for Auth.js |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |
| `STRIPE_SECRET_KEY` | Stripe secret key (test mode) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the Stripe webhook endpoint |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `EMAIL_FROM` | Verified sender address for confirmation emails |
| `NEXT_PUBLIC_APP_URL` | Public base URL used to build absolute links |
| `ADMIN_EMAILS` | Comma-separated allowlist of admin email addresses |

---

## Testing

The following flows were exercised during development:

- **Authentication** — Google and GitHub sign-in, sign-out, and session
  persistence across reloads.
- **Registration** — valid submissions, invalid input, and duplicate-registration
  handling.
- **Stripe test payment** — Checkout Session creation and a successful test
  payment with card `4242 4242 4242 4242`.
- **Webhook** — signature verification and safe handling of duplicate or retried
  event delivery.
- **Confirmation email** — a single email sent after a verified payment, with no
  duplicate on webhook retry.
- **Admin authorization** — a normal user cannot reach the admin pages or data;
  an allowlisted admin can.
- **Responsive and accessibility checks** — layouts from ~360px to wide desktop,
  keyboard navigation, landmark structure, text contrast, and reduced-motion
  behaviour.

`npm run lint`, `npm run typecheck`, and `npm run build` are run as part of the
workflow.

---

## Deployment

- Deployed on **Vercel**, with the repository connected to **GitHub** for
  continuous deployment from the main branch.
- **PostgreSQL** is hosted on **Neon**.
- **Stripe** runs in **Test Mode**, with a webhook endpoint configured for the
  deployed URL.
- **Resend** handles transactional email in the deployed environment.
- Production environment variables are set in the Vercel project settings.

---

## Academic / Engineering Highlights

A real-world full-stack web development project that demonstrates:

- **Authentication** with a third-party identity provider (OAuth) and
  database-backed sessions.
- **Authorization** enforced server-side, including role-based access control.
- **Relational database design** with Prisma migrations and a seed workflow.
- **Payment integration** using Stripe Checkout in Test Mode with a
  server-controlled amount.
- **Webhook processing** with signature verification and idempotent state
  updates.
- **Transactional email** delivered once after a verified payment.
- **Responsive frontend engineering** with an editorial design system and
  accessibility as a first-class concern.
