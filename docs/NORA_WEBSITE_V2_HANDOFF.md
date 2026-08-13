# NORA Website V2 — Handoff

## Product identity
Customer-facing brand is **NORA**. Do not use "Project NEED" in marketing navigation, hero copy, social metadata, or footer. Existing legal page wording is intentionally untouched while Meta App Review is active.

## Design direction
NORA is a serious operating system with a warm personality expressed through words and behavior. No robot, humanoid AI avatar, glowing brain, or generic AI imagery. The visual language should feel calm, premium, operational, and credible.

Core promise: NORA reduces the owner's mental load by asking, following up, verifying, documenting, remembering, and escalating by exception.

## TRY NORA architecture
Browser requests go only to `POST /api/nora-demo/chat` in this marketing website. The browser never receives a demo-agent credential and never talks directly to the production NORA backend.

The server route can forward to an isolated demo service when these server-only env vars are configured:
- `NORA_DEMO_AGENT_URL`
- `NORA_DEMO_AGENT_TOKEN`

Until that isolated service exists, the route returns a clearly controlled guided fallback response. Do not describe the deployed fallback as a fully live AI agent until `NORA_DEMO_AGENT_URL` is wired to a real sandbox agent.

## Isolation requirements for the future demo agent
The public demo agent must have no production tenant credentials, no Supabase customer-data access, no production WhatsApp access, no work-order/action tools, and no ability to mutate real business records. It may qualify a prospect, explain NORA, simulate operational scenarios, and later route an explicit lead/demo request through dedicated prospect-only tooling.

## Current V2 files
New/major redesign:
- `src/components/brand.tsx`
- `src/components/hero.tsx`
- `src/components/peace-of-mind.tsx`
- `src/components/accountability.tsx`
- `src/components/try-nora.tsx`
- `src/components/nav.tsx`
- `src/components/footer.tsx`
- `src/app/[lang]/page.tsx`
- `src/app/globals.css`
- `src/app/api/nora-demo/chat/route.ts`

New brand assets:
- `public/brand/nora-logo.png`
- `public/brand/nora-icon.png`
- `public/brand/nora-app-icon.png`
- `public/favicon.ico`
- `public/og-default.png`

## Do not change during Meta review
Keep the existing privacy policy, terms of service, and data-deletion route URLs and legal copy stable unless there is a deliberate legal/Meta-review decision to change them.
