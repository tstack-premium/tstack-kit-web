# Backend Payment Automation — Implementation Plan

> **Status**: TODO — Not yet implemented  
> **Purpose**: Automate post-payment GitHub repo access instead of manual fulfillment  
> **Current state**: Razorpay Payment Button handles checkout. Orders appear in Razorpay Dashboard → manual invite to private GitHub repo.

---

## Architecture Overview

```
┌─────────────┐    payment     ┌──────────────┐   webhook POST   ┌─────────────────────┐
│   Buyer on   │ ──────────▶  │   Razorpay    │ ──────────────▶ │  Webhook API Server  │
│  tstack web  │              │   Checkout    │                  │  (Deno + Hono)       │
└─────────────┘              └──────────────┘                  └──────┬──────────────┘
                                                                       │
                                                          ┌────────────┴────────────┐
                                                          ▼                         ▼
                                                  ┌──────────────┐         ┌──────────────┐
                                                  │  PostgreSQL   │         │  GitHub API   │
                                                  │  (purchases)  │         │  (invite)     │
                                                  └──────────────┘         └──────────────┘
```

## What Needs To Be Done

### 1. Webhook Receiver API (Deno + Hono)

A lightweight Hono API server to receive Razorpay webhook events.

**Endpoints:**

| Method | Path                      | Purpose                             |
|--------|---------------------------|-------------------------------------|
| POST   | `/webhooks/razorpay`      | Receive Razorpay payment events     |
| GET    | `/health`                 | Health check for deployment         |

**Core handler logic:**

```ts
// POST /webhooks/razorpay
// 1. Verify webhook signature (HMAC SHA256)
// 2. Parse event type — only handle `payment.captured`
// 3. Extract buyer email from payment.notes or payment entity
// 4. Record purchase in database
// 5. Call GitHub API to invite buyer as collaborator
// 6. Send confirmation email (optional)
// 7. Return 200 OK
```

### 2. Razorpay Webhook Signature Verification

**Critical for security** — never trust unverified webhook payloads.

```ts
import { createHmac } from "node:crypto";

function verifyRazorpayWebhook(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}
```

- Razorpay sends the signature in the `X-Razorpay-Signature` header
- The `secret` is the **Webhook Secret** configured in Razorpay Dashboard → Webhooks
- Always compare using timing-safe comparison in production

### 3. Razorpay Dashboard — Webhook Setup

1. Go to **Razorpay Dashboard → Account & Settings → Webhooks**
2. Click **Add New Webhook**
3. Set the URL to: `https://<your-api-domain>/webhooks/razorpay`
4. Select event: `payment.captured`
5. Generate and copy the **Webhook Secret**
6. Store the secret securely as an environment variable

### 4. GitHub API — Auto-invite Collaborator

After payment is captured, invite the buyer to the private repo:

```ts
// Using GitHub REST API
async function inviteCollaborator(githubUsername: string) {
  const response = await fetch(
    `https://api.github.com/repos/desingh-rajan/tstack-kit/collaborators/${githubUsername}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_PAT}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ permission: "pull" }),
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub invite failed: ${response.status}`);
  }
}
```

**Challenge**: Razorpay provides buyer **email**, not GitHub username.  
**Solutions (pick one):**

| Approach | Pros | Cons |
|----------|------|------|
| **A. Add "GitHub username" field in Razorpay checkout notes** | Direct mapping, no extra steps | Buyer might enter wrong username |
| **B. Post-payment form** — redirect to a form where buyer enters GitHub username | More reliable, can validate username | Extra step for buyer |
| **C. Email the buyer** asking for their GitHub username | Simple, no extra UI | Manual back-and-forth delays |
| **D. Look up GitHub user by email** via GitHub API | Fully automated | Only works if email is public on GitHub |

**Recommended**: Option **B** — post-payment redirect to a small form on your site:

- Buyer enters GitHub username + payment ID (or email for verification)
- Backend validates payment exists in DB, then invites

### 5. Database Schema (PostgreSQL)

```sql
CREATE TABLE purchases (
  id            SERIAL PRIMARY KEY,
  razorpay_payment_id   TEXT UNIQUE NOT NULL,
  razorpay_order_id     TEXT,
  buyer_email           TEXT NOT NULL,
  buyer_name            TEXT,
  github_username       TEXT,
  amount_paise          INTEGER NOT NULL,
  currency              TEXT NOT NULL DEFAULT 'INR',
  status                TEXT NOT NULL DEFAULT 'captured',
  github_invited        BOOLEAN DEFAULT FALSE,
  github_invited_at     TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_purchases_email ON purchases(buyer_email);
CREATE INDEX idx_purchases_payment_id ON purchases(razorpay_payment_id);
```

### 6. Environment Variables / Secrets

| Variable | Source | Purpose |
|----------|--------|---------|
| `RAZORPAY_KEY_ID` | Razorpay Dashboard → API Keys | API authentication |
| `RAZORPAY_KEY_SECRET` | Razorpay Dashboard → API Keys | API authentication |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Dashboard → Webhooks | Verify webhook signatures |
| `GITHUB_PAT` | GitHub → Developer Settings → PAT (fine-grained) | Invite collaborators. Scope: `repo` admin on target repo |
| `DATABASE_URL` | PostgreSQL connection string | Store purchase records |

**GitHub PAT scopes needed** (fine-grained token):

- Repository access: `desingh-rajan/tstack-kit` (specific repo)
- Permissions: `Administration: Write` (to manage collaborators)

### 7. Deployment Options

| Option | Pros | Cons |
|--------|------|------|
| **Same AWS Lightsail via Kamal** | Reuse existing infra, shared Postgres | Co-located with marketing site |
| **Deno Deploy (serverless)** | Free tier, zero infra management, global edge | Need external DB (e.g., Neon, Supabase) |
| **Separate small VPS** | Isolated, dedicated | More infra to manage |

**Recommended**: **Deno Deploy** — it's free, serverless, and perfect for a single webhook endpoint. Use Neon or Supabase for Postgres.

### 8. Error Handling & Resilience

- **Idempotency**: Use `razorpay_payment_id` as unique key — if webhook fires twice, don't double-invite
- **Retry**: If GitHub API fails, mark `github_invited = false` — run a periodic cron to retry failed invites
- **Logging**: Log all webhook events (payment ID, email, status) for audit trail
- **Alerting**: Send yourself a Slack/Discord notification on payment captured (and on errors)
- **Rate limits**: GitHub API has rate limits (5,000 req/hr for authenticated). Not a concern at current scale

### 9. Testing Checklist

- [ ] Webhook receives test payment event from Razorpay (Test Mode)
- [ ] Signature verification rejects tampered payloads
- [ ] Payment is recorded in database
- [ ] GitHub collaborator invite is sent successfully
- [ ] Duplicate webhook calls don't create duplicate invites
- [ ] Error cases: invalid GitHub username, expired PAT, DB down

---

## Future Enhancements

- **Stripe webhook support** — add `POST /webhooks/stripe` with Stripe signature verification
- **LemonSqueezy webhook support** — add `POST /webhooks/lemonsqueezy`
- **Multi-currency** — handle USD payments alongside INR
- **Admin dashboard** — view all purchases, resend invites, revoke access
- **License key generation** — issue unique license keys per purchase
- **Refund handling** — listen to `payment.refunded` event → revoke GitHub access
- **Email notifications** — send transactional emails (welcome, receipt, access granted)

---

## Quick Start (when ready to implement)

```bash
# 1. Scaffold the project
mkdir tstack-webhook-api && cd tstack-webhook-api
deno init

# 2. Add dependencies
# Hono (web framework), postgres (DB driver)

# 3. Create the webhook handler
# See sections 1-3 above

# 4. Deploy to Deno Deploy
deployctl deploy --project=tstack-webhooks main.ts

# 5. Configure webhook URL in Razorpay Dashboard
# https://tstack-webhooks.deno.dev/webhooks/razorpay
```
