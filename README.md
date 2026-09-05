# Vekio

Vekio is a tradie identity, trust and enquiry platform. A tradie creates a Vekio ID, publishes a professional profile, adds trust/profile assets, receives direct customer enquiries, and can reuse the same business identity through Print.Vekio to create physical marketing artwork.

## Current Production Status

**Vekio Core V1 is functional.**

Current working flow:

`Tradie account → Dashboard → Public profile → Customer enquiry → Supabase → Email notification`

Print.Vekio currently extends the tradie's existing Vekio identity into personalised print artwork.

## Vekio Core V1

Working functionality includes:

- Tradie registration and account activation
- Supabase authentication
- Login, logout, forgot password and password reset
- Tradie dashboard
- Public tradie profile
- Business/contact details
- About/business description
- Service area
- Profile photo/logo upload
- Trade licence upload
- Insurance upload
- Project gallery
- Trust and verification display
- Profile completion indicators
- Direct customer enquiry form
- Enquiry storage in Supabase
- Tradie-specific enquiry access
- Email notification for new enquiries
- Auth-aware navigation between public profile and dashboard

## Print.Vekio

Print.Vekio reuses the tradie's Vekio profile data rather than making them enter their business information again.

Current/implemented products:

- Fridge Magnets
- Business Cards

Planned next:

- Flyers
- Additional print marketing products
- Production-ready artwork improvements
- Printer/fulfilment integration

Print.Vekio artwork can use:

- Business name
- Contact person
- Trade/profession
- Phone
- Email
- Service area
- Profile image/logo
- Unique tradie Vekio URL
- Unique QR code linking to that tradie's public Vekio profile

## Technology

- **Frontend / App:** Next.js
- **Hosting / Deployment:** Vercel
- **Database / Authentication / Storage:** Supabase
- **Email:** Resend
- **Source Control:** GitHub

## Production Source of Truth

**The `main` branch of this GitHub repository is the source of truth for the current production application.**

Normal deployment flow:

`GitHub main → Vercel → www.vekio.com.au`

Before making substantial changes, work from a fresh copy of the current `main` branch rather than an older local ZIP.

## Important: Preserve Working V1

> **DO NOT REBUILD VEKIO CORE FROM SCRATCH.**
>
> This repository contains the working Vekio Core V1 production architecture. Extend the existing system rather than replacing working authentication, profile, storage, RLS, enquiry, email or navigation flows without a specific reason and a tested migration path.

In particular, changes to these areas should be treated carefully:

- Supabase authentication/session handling
- Row Level Security policies
- Storage buckets and upload policies
- `tradies` data
- `enquiries` data
- Public profile routing
- Dashboard routing
- Enquiry submission
- Resend notification flow
- Print.Vekio tradie-specific QR generation

## Supabase / SQL

SQL migration/setup files are retained in the repository for reference.

Current files include:

- `profile-photo-upload.sql`
- `tradie-assets-upload.sql`
- `vekio-core-v1-finish.sql`

Do not blindly rerun old SQL against production. Inspect the current Supabase schema and policies first.

### Enquiry RLS

The public enquiry flow requires INSERT access for customers visiting a tradie's public profile.

The working production configuration allows enquiry insertion for both:

- `anon`
- `authenticated`

This is intentional: logged-out customers can submit enquiries, while a logged-in tradie can also test their own public enquiry form.

Tradies should only be able to read enquiries permitted by the appropriate authenticated SELECT policy.

## Enquiry Flow

The working enquiry path is:

`Public tradie profile`
→ `Supabase enquiries INSERT`
→ `/api/send-enquiry`
→ `Resend`
→ `Tradie email inbox`

A failed Supabase insert occurs before the email API is called, so browser console/Supabase errors should be checked when `/api/send-enquiry` does not appear in server logs.

## Print.Vekio Principle

Vekio already knows the tradie.

Print.Vekio should therefore pre-fill as much as possible from the tradie's Vekio ID and only ask the user to customise what is necessary for the print product.

The intended experience is:

`Choose product → Vekio pre-fills identity → Customise → Preview → Generate artwork → Print`

## Development Rules

1. Treat GitHub `main` as production truth.
2. Start new work from the latest production code.
3. Do not overwrite proven V1 flows unnecessarily.
4. Prefer small, testable extensions.
5. Do not run SQL merely because a UI feature changes.
6. Test authentication changes both logged in and logged out.
7. Test public enquiry submission as both `anon` and `authenticated`.
8. Verify tradie-specific QR codes resolve to the correct public profile.
9. Let Vercel complete its deployment before production testing.
10. Keep production credentials and secrets out of this repository.

## Product Direction

Vekio's core loop is:

**Identity → Trust → Discovery/physical promotion → Direct enquiry**

Print.Vekio turns the same digital identity into reusable physical marketing, beginning with fridge magnets, business cards and flyers.

---

**Checkpoint:** Vekio Core V1 working production system. Extend it; don't accidentally resurrect yesterday's bugs.
