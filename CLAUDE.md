# AFTERIMAGE — Event Platform

## 1. PROJECT MISSION

Build a production-quality event registration web application for a paid workshop.

The application must satisfy all assignment requirements:

1. Google OAuth login.
2. GitHub OAuth login.
3. Paid workshop registration.
4. Stripe Checkout in TEST MODE.
5. Secure backend/API routes.
6. Role-based authorization.
7. Only ADMIN users can access the registered-user list.
8. Professional confirmation email after successful payment.
9. Publicly deployed production application.

The product must look intentionally designed by a human designer.

DO NOT build a generic AI-generated SaaS dashboard.

---

# 2. PRODUCT IDENTITY

## Brand

Name:

AFTERIMAGE

Positioning:

A premium independent workshop/event studio.

The website should feel like an editorial publication combined with a contemporary workshop studio.

It should NOT feel like:

- SaaS startup
- admin template
- AI-generated landing page
- generic event marketplace
- corporate registration portal

---

# 3. VISUAL DESIGN SYSTEM

## Overall aesthetic

Use:

- editorial layouts
- strong typography
- large display headings
- asymmetrical compositions
- generous whitespace
- thin borders
- restrained animation
- warm neutral surfaces
- subtle texture
- strong hierarchy
- intentional negative space
- occasional oversized typography
- small monospace metadata labels

Prefer composition over decoration.

Every visual element must have a reason to exist.

## Colors

Primary background:

Warm off-white / paper-like neutral.

Primary text:

Near-black.

Primary accent:

Burnt orange / vermillion.

Secondary accent:

Muted olive.

Use accent colors sparingly.

Do NOT turn every button, card or heading into an accent color.

Avoid:

- purple gradients
- blue/purple SaaS gradients
- neon gradients
- rainbow gradients
- excessive glassmorphism
- glowing cards

# 4. TYPOGRAPHY

Use a deliberate typographic pairing.

Display typography:

Editorial serif.

UI/body typography:

Clean modern sans-serif.

Metadata:

Monospace.

Hierarchy should be obvious.

Example:

AFTERIMAGE

A WORKSHOP IN
MAKING THINGS
THAT LAST.

Then smaller metadata:

12 OCTOBER 2026
BENGALURU
48 SEATS

Avoid making every text element visually identical.

# 5. LAYOUT PRINCIPLES

Do not default to:

centered hero
3 feature cards
testimonial cards
pricing cards
generic CTA
footer

That is a common AI-generated SaaS pattern.

Instead use:

- editorial columns
- asymmetric grids
- large margins
- vertical separators
- image + typography compositions
- oversized numerals
- horizontal rules
- section labels
- intentional alignment changes
- long-form content layouts

Use cards only where a card genuinely improves usability.

# 6. MICROCOPY

Do not use generic AI marketing language.

Avoid phrases such as:

- Unlock your potential
- Elevate your experience
- Seamless experience
- Take your journey to the next level
- Revolutionize
- Empower yourself
- Built for the future
- Transform your workflow

Write specific copy.

Example:

BAD:

"Join an unforgettable learning experience."

GOOD:

"One day. Forty-eight seats. Build something real."

Copy should sound like a real event organizer wrote it.

# 7. REQUIRED TECHNOLOGY

Use:

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- Auth.js
- Google OAuth
- GitHub OAuth
- Stripe Checkout
- Resend
- Vercel

Avoid introducing additional infrastructure unless there is a concrete reason.

Do NOT introduce:

- microservices
- Kubernetes
- GraphQL
- Redis
- message queues
- unnecessary backend frameworks
- unnecessary state-management libraries

Keep the architecture understandable.

# 8. APPLICATION STRUCTURE

Preferred structure:

app/
├── page.tsx
├── login/
│   └── page.tsx
├── register/
│   └── page.tsx
├── checkout/
│   └── page.tsx
├── success/
│   └── page.tsx
├── dashboard/
│   └── page.tsx
├── admin/
│   ├── page.tsx
│   └── users/
│       └── page.tsx
└── api/
    ├── auth/
    ├── registration/
    ├── checkout/
    └── stripe/
        └── webhook/

components/
├── ui/
├── navigation/
├── workshop/
├── registration/
├── checkout/
└── admin/

lib/
├── auth.ts
├── prisma.ts
├── stripe.ts
├── email.ts
└── permissions.ts

prisma/
└── schema.prisma

public/

Adapt the structure when Next.js conventions require it, but preserve separation of concerns.

# 9. DATABASE

Use PostgreSQL + Prisma.

Core entities:

User
Account
Session
Registration
Payment
Workshop

## User

Should support Auth.js.

Fields should include appropriate data for:

- id
- name
- email
- image
- role
- createdAt
- updatedAt

Roles:

USER
ADMIN

Default role:

USER

Never allow users to set their own role.

## Account

Use Auth.js-compatible OAuth account model.

## Session

Use the Auth.js-compatible session model where applicable.

## Registration

Should contain appropriate fields such as:

- id
- userId
- fullName
- email
- phone
- organization/institution
- status
- createdAt
- updatedAt

Registration status can include:

PENDING
PAID
CANCELLED

Prevent duplicate registrations for the same user/workshop.

Use proper database constraints.

## Payment

Should contain appropriate fields such as:

- id
- registrationId
- stripeSessionId
- stripePaymentIntentId
- amount
- currency
- status
- createdAt
- updatedAt

Possible statuses:

PENDING
PAID
FAILED
REFUNDED

Use Stripe identifiers as appropriate.

## Workshop

Keep the model simple.

Possible fields:

- id
- title
- description
- date
- location
- price
- currency
- capacity
- createdAt
- updatedAt

Do not build multi-event marketplace functionality unless explicitly required.

# 10. AUTHENTICATION

Use Auth.js.

Providers:

- Google
- GitHub

Required behavior:

1. User clicks login.
2. User authenticates with OAuth provider.
3. Application establishes authenticated session.
4. User record is created/updated.
5. User can register for the workshop.
6. User can access their own dashboard.
7. ADMIN users can access administrative pages.

Do not implement username/password authentication unless explicitly requested.

# 11. AUTHORIZATION

This is security-critical.

Never rely only on hiding UI.

Bad:

if admin:
    show admin button

That is NOT sufficient.

Server-side routes must verify:

1. User is authenticated.
2. User has ADMIN role.

Every admin API/action must perform an authorization check.

Users must never be able to change their own role through a request.

Do not trust role data supplied by the client.

Centralize authorization logic where practical.

Example concept:

requireUser()
requireAdmin()

# 12. USER ACCESS RULES

Normal authenticated users may:

- view workshop
- register
- create payment
- view their own registration
- view their own payment status

They must NOT be able to:

- view other users' registrations
- modify other users' registrations
- access admin APIs
- modify roles
- access sensitive payment data belonging to other users

# 13. REGISTRATION FLOW

Expected flow:

Landing page
      ↓
Login
      ↓
Workshop
      ↓
Registration form
      ↓
Validation
      ↓
Create registration
      ↓
Stripe Checkout

Registration fields should include:

- full name
- email
- phone
- organization/institution

Use both client-side and server-side validation.

Never trust client-side validation alone.

Prevent duplicate registrations.

# 14. STRIPE

Use Stripe Checkout.

TEST MODE ONLY.

Never hardcode secret keys.

Never expose:

STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

to client-side code.

Create Checkout Sessions server-side.

Associate the checkout session with the registration.

Use Stripe metadata to store an appropriate internal registration identifier.

# 15. PAYMENT SECURITY

This is extremely important.

Do NOT do this:

User returns to /success
→ mark payment as PAID

The success redirect is not sufficient evidence of payment.

Correct flow:

User
 ↓
Stripe Checkout
 ↓
Payment completes
 ↓
Stripe webhook
 ↓
Verify Stripe webhook signature
 ↓
Process event
 ↓
Mark Payment PAID
 ↓
Mark Registration PAID
 ↓
Send confirmation email

Webhook signatures MUST be verified.

Handle duplicate webhook delivery safely.

Payment processing must be idempotent.

Do not send duplicate confirmation emails because Stripe retries a webhook.

# 16. STRIPE WEBHOOK

Webhook endpoint should:

1. Receive raw request body.
2. Verify Stripe signature.
3. Determine event type.
4. Identify associated registration.
5. Check current payment state.
6. Apply update safely.
7. Return appropriate response.

Handle relevant Stripe events.

Do not trust arbitrary data from the browser.

# 17. EMAIL

Use Resend.

Email should only be sent after verified payment.

Email content:

AFTERIMAGE

REGISTRATION CONFIRMED

Hi [Name],

Your place at AFTERIMAGE is confirmed.

WORKSHOP
[Workshop Name]

DATE
[Date]

LOCATION
[Location]

REGISTRATION
[Registration ID]

PAYMENT
Paid

Use a professional HTML email.

Design should match the website.

Avoid excessive gradients and decorative UI in the email.

Confirmation email sending must be idempotent.

# 18. ENVIRONMENT VARIABLES

Use environment variables for all secrets.

Expected variables:

DATABASE_URL=

AUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

RESEND_API_KEY=

NEXT_PUBLIC_APP_URL=

Never expose secret values in client bundles.

Never commit .env, .env.local, or secret files.

Maintain:

.env.example

with placeholder values.

# 19. SECURITY

Before declaring the application complete, inspect for:

- authentication bypasses
- authorization bypasses
- insecure API routes
- missing server-side validation
- exposed secrets
- insecure redirects
- user enumeration issues
- duplicate registration vulnerabilities
- duplicate payment handling
- webhook signature bypasses
- insecure database queries
- improper data exposure
- client-side trust of role/price/payment values

Fix real problems rather than merely documenting them.

# 20. PRICE SECURITY

The browser must NEVER be the source of truth for the payment amount.

Do not accept arbitrary prices from the client.

Server-side code should determine the workshop price.

Bad:

POST { amount: 1 }

and then charging that value.

Correct:

Registration references workshop
        ↓
Server loads workshop price
        ↓
Server creates Stripe Checkout Session

# 21. ADMIN DASHBOARD

Admin dashboard should display useful operational information.

Suggested sections:

REGISTRATIONS
48

PAID
42

PENDING
6

Then a table:

NAME
EMAIL
REGISTRATION
PAYMENT
DATE

Include search/filtering when useful.

Do not turn it into a giant analytics dashboard.

No unnecessary charts.

The admin page should prioritize information density and usability.

# 22. ADMIN SECURITY

The following MUST all be protected:

- /admin
- /admin/users
- admin API routes
- admin server actions
- administrative database queries

Hiding navigation links is not authorization.

Direct URL access by a normal user must fail.

# 23. USER DASHBOARD

User dashboard should show:

- workshop
- registration status
- payment status
- registration ID
- date
- location

Do not expose another user's data.

Do not build unnecessary profile-management functionality.

# 24. LOGIN PAGE

Keep login simple.

Visual direction:

AFTERIMAGE

YOU'RE ON THE LIST.

Continue with:

[ Continue with Google ]

[ Continue with GitHub ]

-----------------------

No password to remember.

Do not use a generic centered SaaS authentication card if the editorial layout provides a better composition.

# 25. HOMEPAGE

The homepage is the primary visual showcase.

Suggested information hierarchy:

AFTERIMAGE

A WORKSHOP IN
MAKING THINGS
THAT LAST.

12 OCTOBER 2026
BENGALURU
48 SEATS

[ RESERVE YOUR SEAT ]

--------------------------------

THE WORKSHOP

Editorial description

--------------------------------

WHAT YOU'LL LEARN

01 Ideation
02 Prototyping
03 Building
04 Shipping

--------------------------------

THE DETAILS

Date
Location
Duration
Capacity

--------------------------------

YOUR PLACE

₹999

[ RESERVE ]

This is a direction, not an exact template.

Improve it where appropriate.

# 26. RESPONSIVE DESIGN

The website must work properly on:

- desktop
- tablet
- mobile

Do not simply shrink the desktop layout.

Create intentional mobile compositions.

Check:

- typography
- navigation
- forms
- Stripe CTA
- table overflow
- spacing
- button sizes
- image cropping

# 27. ACCESSIBILITY

Use:

- semantic HTML
- keyboard navigation
- proper labels
- visible focus states
- sufficient contrast
- descriptive button labels
- appropriate heading hierarchy
- accessible form errors

Do not rely on color alone to communicate status.

# 28. ANIMATION

Animation should be restrained.

Use animation to support:

- navigation
- page transitions
- subtle reveal
- hover feedback
- loading states

Do NOT:

- animate everything
- use constant floating elements
- use excessive parallax
- create distracting background animation

Respect reduced-motion preferences.

# 29. IMAGES

Do not use random stock photos.

If imagery is needed, use a coherent visual direction.

Prefer:

- workshop photography
- abstract editorial photography
- carefully selected event imagery
- typography-led compositions

Every image must support the event's identity.

Avoid generic corporate stock photography.

# 30. COMPONENT DESIGN

Build reusable components where appropriate.

Examples:

Button
SectionLabel
WorkshopMeta
RegistrationForm
StatusBadge
AdminTable

Do not create dozens of abstractions for trivial elements.

Avoid unnecessary component fragmentation.

# 31. CODE QUALITY

Use TypeScript properly.

Avoid any unless genuinely unavoidable.

Prefer clear types.

Use server components by default where appropriate.

Use client components only when client-side behavior is needed.

Keep business logic outside UI components when practical.

# 32. ERROR HANDLING

Every important action needs a useful error state.

Examples:

- login failure
- registration validation failure
- duplicate registration
- Stripe checkout failure
- payment cancellation
- webhook failure
- email failure
- database failure

Do not show raw stack traces to users.

Give users understandable messages.

Log useful server-side information without exposing secrets.

# 33. LOADING STATES

Important async actions should have loading states.

Examples:

Signing in...
Creating registration...
Redirecting to checkout...
Processing...

Prevent duplicate clicks while requests are running.

# 34. SUCCESS PAGE

Success page should communicate:

REGISTRATION CONFIRMED

Your payment has been received.

We'll send your confirmation to:

user@example.com

REGISTRATION
AF-2026-0042

[ VIEW MY REGISTRATION ]

Do not claim payment is successful merely because the user reached the page.

The page can display current payment status based on server data.

# 35. CANCELLED PAYMENT

If Stripe checkout is cancelled:

Do not delete the registration automatically unless there is a clear reason.

Display:

PAYMENT NOT COMPLETED

Your registration is saved.

You can return to checkout when you're ready.

Keep the UX predictable.

# 36. TESTING

At minimum test:

### Authentication

- Google login
- GitHub login
- logout
- unauthenticated access

### Authorization

- USER cannot access /admin
- ADMIN can access /admin

### Registration

- valid registration
- invalid registration
- duplicate registration

### Stripe

- checkout session creation
- cancellation
- successful test payment
- webhook
- duplicate webhook

### Email

- successful payment sends email
- duplicate webhook does not send duplicate email

### Data isolation

- user can only see own registration
- admin can see registered users

# 37. REQUIRED LOCAL COMMANDS

Before declaring a phase complete, run appropriate checks.

At minimum:

npm run lint
npm run build

Run tests when configured.

If a command fails:

DO NOT simply report the failure.

Investigate and fix it.

# 38. DEVELOPMENT PROCESS

Work in phases.

Do not attempt to build the entire application blindly in one pass.

Preferred order:

PHASE 1
Foundation + design system

PHASE 2
Database + Prisma

PHASE 3
Authentication

PHASE 4
Registration

PHASE 5
Stripe

PHASE 6
Stripe webhook

PHASE 7
Email

PHASE 8
Admin

PHASE 9
UX/UI refinement

PHASE 10
Security audit

PHASE 11
Testing

PHASE 12
Deployment

After each major phase:

1. inspect changes
2. run lint
3. run build
4. test functionality
5. fix issues
6. commit changes

# 39. GIT

Make focused commits.

Example:

feat: create application foundation
feat: add prisma schema
feat: implement OAuth authentication
feat: add workshop registration
feat: integrate Stripe checkout
feat: add Stripe webhook
feat: add confirmation email
feat: create admin dashboard
refactor: improve authorization checks
style: refine editorial visual system
chore: prepare production deployment

Do not make one giant commit containing everything.

# 40. CLAUDE CODE BEHAVIOR

When working on this project:

DO:

- inspect the existing code before changing it
- understand existing architecture
- preserve working functionality
- make small changes
- explain important architectural decisions
- run checks after changes
- fix errors
- reuse existing components
- verify security-sensitive changes carefully

DO NOT:

- rewrite working code unnecessarily
- install libraries without justification
- introduce random architecture
- create placeholder functionality and call it complete
- fake payment success
- fake authentication
- fake admin authorization
- expose secrets
- use client-side role checks as the security mechanism
- mark Stripe payment successful from a redirect alone

# 41. DESIGN REVIEW RULE

Before declaring the UI finished, inspect every page as a visual designer.

For each page ask:

1. Does this look like an independent workshop brand?
2. Does the layout have a clear visual hierarchy?
3. Does typography feel intentional?
4. Are there unnecessary cards?
5. Are there generic SaaS patterns?
6. Is the page too symmetrical?
7. Is whitespace intentional?
8. Does every decorative element have purpose?
9. Would a human designer plausibly ship this?
10. Does it look different from common AI-generated websites?

If the answer to #10 is no, redesign it.

# 42. AI-GENERATED DESIGN RED FLAGS

Immediately reconsider any section containing several of these:

- gradient hero
- centered headline
- three rounded cards
- pill-shaped buttons everywhere
- floating blurred circles
- excessive shadows
- identical card dimensions
- meaningless sparkle icons
- excessive glassmorphism
- generic dashboard metrics
- "Seamless", "innovative", "transform", "empower"
- random decorative blobs
- huge empty gradient backgrounds

One such element can be fine.

A page full of them is not.

# 43. DO NOT OVERDESIGN

Unique does not mean complicated.

The design should be distinctive through:

- typography
- spacing
- composition
- copy
- visual rhythm

not through dozens of effects.

# 44. DEPLOYMENT

Target deployment:

GitHub
   ↓
Vercel
   ↓
Next.js
   ↓
PostgreSQL
   ↓
Stripe
   ↓
Resend

Production deployment must use production environment variables.

Never commit credentials.

Configure OAuth production callback URLs.

Configure Stripe production webhook endpoint in Stripe TEST MODE.

Verify the deployed site end-to-end.

# 45. PRODUCTION CHECKLIST

## Application

[ ] Landing page works
[ ] Login works
[ ] Google OAuth works
[ ] GitHub OAuth works
[ ] Registration works
[ ] Duplicate registration prevented
[ ] Stripe Checkout works in TEST MODE
[ ] Stripe webhook works
[ ] Payment state updates correctly
[ ] Confirmation email works
[ ] User dashboard works
[ ] Admin dashboard works
[ ] Admin authorization works
[ ] Normal users cannot access admin
[ ] Mobile layout works
[ ] Desktop layout works
[ ] Error states work
[ ] Loading states work

## Security

[ ] Secrets are not committed
[ ] Secrets are not client-exposed
[ ] Admin authorization is server-side
[ ] Stripe webhook signature verified
[ ] Payment amount is server-controlled
[ ] Duplicate webhook handling is safe
[ ] Duplicate registration prevented
[ ] User data isolation verified

## Deployment

[ ] Production build succeeds
[ ] Vercel deployment works
[ ] PostgreSQL production database works
[ ] OAuth production callbacks work
[ ] Stripe webhook production URL configured
[ ] Resend production email works
[ ] Environment variables configured
[ ] Final deployed URL tested

# 46. FINAL RESPONSE FORMAT

When finishing a development phase, report:

PHASE COMPLETE

Implemented:
- ...
- ...
- ...

Security:
- ...

Validation:
- npm run lint
- npm run build

Files changed:
- ...

Known issues:
- ...

Next recommended phase:
- ...

Never claim something is complete unless it has actually been implemented and checked.

# 47. IMPORTANT RULE

The assignment is not asking for the most technically complicated application.

It is asking for a working real-world paid workshop registration platform.

Prioritize:

1. correctness
2. security
3. reliability
4. usability
5. visual identity
6. deployment

Do not sacrifice correctness for visual effects.

Do not sacrifice security for convenience.

Do not sacrifice usability for uniqueness.

The finished result should feel like a real event product that happens to demonstrate strong engineering.

# FRONTEND DESIGN DIRECTIVE

## Design Goal

The frontend must look like a deliberately art-directed event website.

It must NOT look like:
- an AI SaaS template
- a dashboard template
- a shadcn demo
- a Tailwind landing-page template
- a generic startup website

The event itself is the product.

Design should communicate:
- culture
- craft
- exclusivity
- physicality
- editorial quality

## Design Process

Before implementing a major page:

1. Establish the visual hierarchy.
2. Decide the composition.
3. Define typography hierarchy.
4. Define spacing rhythm.
5. Define interaction behavior.
6. Only then write the React implementation.

Do not start by creating cards.

## Layout

Prefer:
- asymmetric grids
- editorial columns
- oversized typography
- horizontal rules
- large negative space
- intentional misalignment
- image-led compositions
- numbered sections
- small metadata labels

Avoid:
- three-card feature rows
- everything centered
- excessive rounded cards
- excessive container boxes
- dashboard-style metric cards

## Typography

Use:
- expressive serif display typography
- clean sans-serif for interface text
- monospace for technical metadata

Create obvious contrast between:
- display
- section titles
- body
- metadata
- CTA

## Shape Language

Use restrained corner radii.

Do not make every element a pill or rounded rectangle.

Buttons should feel designed, not like default component-library buttons.

## Color

Use a restrained palette.

Base:
- warm paper/off-white
- near-black

Accent:
- burnt orange / vermillion

Secondary:
- muted olive

No purple startup gradients.

No rainbow gradients.

No excessive glow.

## Motion

Use Motion for meaningful interactions.

Good uses:
- page entrance
- section reveal
- staggered typography
- hover interaction
- image movement
- navigation transitions
- subtle parallax
- modal transitions

Bad uses:
- constant floating objects
- excessive bouncing
- animation on every element
- distracting background effects

Respect prefers-reduced-motion.

## Motion Implementation

Use:

import { motion } from "motion/react"

Keep animation definitions reusable where appropriate.

Prefer subtle, high-quality motion rather than many animations.

Animations should communicate hierarchy and interaction, not exist merely for decoration.

## Reference Designs

When a reference design is supplied:

- analyze its layout
- analyze its typography
- analyze spacing
- analyze interaction patterns
- analyze visual hierarchy

Use the reference as a design direction.

Do NOT copy the branding, text, images, logos, or exact visual assets.

Adapt the structure and principles to AFTERIMAGE.

## Visual QA

After implementing a page:

1. Run the application.
2. Inspect it in a browser.
3. Compare against the intended visual direction.
4. Identify generic/template-looking areas.
5. Fix them.
6. Check mobile.
7. Check reduced motion.
