# Stayora AI — SaaS starter

A deployable full-stack starter for an AI writing assistant for short-term-rental hosts.

## Included
- Marketing website and pricing page
- Supabase email/password authentication
- Protected host workspace
- Property profiles (create/list/delete)
- AI draft generator: guest replies, translation, listing copy, review replies, local guide drafts
- Usage logging and basic monthly draft limits
- Stripe Checkout, Billing Portal and webhook sync
- Admin overview gated by `ADMIN_USER_IDS`
- Supabase SQL schema and row-level security policies

## Important scope note
This is a production-oriented MVP codebase, not a deployed/fully audited commercial service. It does **not** connect directly to Airbnb or Booking.com, send guest messages automatically, or verify live local information. Hosts must review every AI draft. Before taking payments from the public, complete the launch checklist, legal/privacy work, monitoring, backups, security review and end-to-end testing.

## Requirements
- Node.js 20+
- Supabase project
- OpenAI API key
- Stripe account (for paid plans)

## Local setup
1. Copy `.env.example` to `.env.local`.
2. Fill in Supabase URL and anon key.
3. In Supabase SQL Editor, run `supabase/schema.sql`.
4. In Supabase Auth settings, configure the site URL and redirect URL:
   - `http://localhost:3000/auth/callback`
   - Your production domain + `/auth/callback`
5. Add an OpenAI API key and optionally choose `OPENAI_MODEL`.
6. Install and run:
   ```bash
   npm install
   npm run dev
   ```
7. Open `http://localhost:3000`.

## Stripe setup
1. Create three recurring monthly prices in Stripe: Starter €9, Pro €19, Business €49.
2. Put their `price_...` IDs in the three `STRIPE_PRICE_*` environment variables.
3. Configure the Stripe Customer Portal in Dashboard.
4. Add webhook endpoint:
   `https://YOUR_DOMAIN/api/stripe/webhook`
5. Subscribe to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
7. Set `NEXT_PUBLIC_APP_URL` to your actual domain.

## Admin
Set `ADMIN_USER_IDS` to a comma-separated list of trusted Supabase user UUIDs. The admin route is `/admin`. Do not expose the service-role key to the browser.

## Before production launch
- Replace placeholder policies and add privacy policy, terms, cookie notice and GDPR data-subject request handling.
- Configure Stripe tax/VAT and invoice settings for your jurisdiction.
- Add rate limiting (e.g. Upstash or platform-level protection) to AI endpoints.
- Add abuse prevention, CAPTCHA on signup, password reset, account deletion and data export.
- Add subscription entitlement checks tied to Stripe status and billing period; test cancellation, failed payment and plan changes.
- Add robust transactional handling and webhook idempotency.
- Add automated tests, error monitoring, logs and backups.
- Review Supabase RLS policies with a security professional.
- Test with test-mode Stripe and a low-cost AI usage budget before launch.

## Product limitations in this MVP
- No direct Airbnb/Booking integration. Their API access is restricted and requires separate approval/partner access.
- No automatic sending. Drafts are generated for host review and manual copy/paste.
- Usage quota is a simple monthly count; add atomic quota reservation/rate limiting for high concurrency.
- Starter fallback is used when no active subscription row exists. For a public launch, consider a proper free trial/free tier and enforce entitlements strictly.
- Admin overview is intentionally minimal.
