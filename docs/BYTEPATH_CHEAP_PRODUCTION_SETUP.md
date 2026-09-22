# BytePath: Cheapest Practical Production Setup

> This document is an older cost-oriented guide. For the current code-aligned
> environment names, GitHub push flow, smoke tests, and go/no-go checks, use
> [`PRODUCTION_RELEASE_CHECKLIST.md`](PRODUCTION_RELEASE_CHECKLIST.md). The
> current storage implementation uses Supabase Storage, not Cloudflare R2.

This guide is the shortest path from the current repository to a working production deployment. It favors managed free or low-cost services over managing servers yourself.

## Recommended stack

| Need | Cheapest/easiest choice | What to create |
|---|---|---|
| Frontend hosting | Cloudflare Pages or Render Static Site | `app.yourdomain.com` |
| Spring Boot API | Render Web Service | `api.yourdomain.com` |
| PostgreSQL | Neon Free or Render PostgreSQL | One production database |
| PDF storage | Cloudflare R2 Standard | Private `bytepath-resources` bucket |
| Email | Resend Free SMTP | Verification/reset mail |
| Payments | Razorpay Live Mode | Live API keys + webhook |
| Domain/DNS/TLS | Cloudflare DNS | HTTPS for both subdomains |

Free tiers change, so confirm current limits before launch. R2 currently includes free monthly Standard storage and request allowances with no egress charge; Neon and Render both offer entry/free options, with production limits and sleeping/availability tradeoffs. See [R2 pricing](https://developers.cloudflare.com/r2/pricing/), [Render pricing](https://render.com/pricing), and [Neon pricing](https://neon.com/2024-plan-updates).

## Accounts to create

Create accounts only for the services you actually use:

1. Cloudflare: domain DNS, Pages, and R2.
2. Render: Spring Boot API deployment.
3. Neon or Render: PostgreSQL.
4. Resend: transactional email.
5. Razorpay: payments and merchant verification.
6. Google Cloud: optional Google sign-in.
7. GitHub Developer Settings: optional GitHub sign-in.

The lowest-cost launch can skip Google OAuth, GitHub OAuth, RAG, and OCR initially. Email, PostgreSQL, R2, the API host, and Razorpay are the important production dependencies.

## Domain layout

Use two HTTPS subdomains:

```text
Frontend: https://app.yourdomain.com
Backend:  https://api.yourdomain.com
```

The backend API base URL used by the frontend is:

```text
https://api.yourdomain.com/api
```

## Backend environment file

Create `backend/.env`. Do not commit it.

```env
PORT=8081
FRONTEND_URL=https://app.yourdomain.com
CORS_ALLOWED_ORIGINS=https://app.yourdomain.com

# PostgreSQL: use the connection details supplied by Neon/Render.
DB_URL=jdbc:postgresql://HOST:5432/DATABASE?sslmode=require
DB_USERNAME=DATABASE_USER
DB_PASSWORD=DATABASE_PASSWORD
DB_DRIVER=org.postgresql.Driver
DDL_AUTO=validate
FLYWAY_ENABLED=true

# Generate: openssl rand -base64 48
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_VALUE
JWT_EXPIRATION_MS=900000

ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=REPLACE_WITH_A_LONG_UNIQUE_PASSWORD
ADMIN_NAME=System Administrator

# Cloudflare R2
R2_ENDPOINT=https://ACCOUNT_ID.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY=R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME=bytepath-resources
R2_PUBLIC_URL=
R2_UPLOAD_URL_EXPIRY_SECONDS=600
R2_DOWNLOAD_URL_EXPIRY_SECONDS=120

# Razorpay Live Mode
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxx
RAZORPAY_KEY_SECRET=RAZORPAY_LIVE_SECRET
RAZORPAY_WEBHOOK_SECRET=RANDOM_WEBHOOK_SECRET

# SMTP; Resend supplies these values after domain verification.
MAIL_HOST=smtp.resend.com
MAIL_PORT=587
MAIL_USERNAME=resend
MAIL_PASSWORD=RESEND_API_KEY
MAIL_FROM=no-reply@yourdomain.com

# Install Tesseract on the API host/container.
TESSERACT_PATH=/usr/bin/tesseract

# Optional Google sign-in
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://api.yourdomain.com/api/auth/google/callback

# Optional GitHub sign-in
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=https://api.yourdomain.com/api/auth/github/callback

# Optional advisor provider
RAG_API_URL=
RAG_API_KEY=
```

Generate secrets locally:

```bash
openssl rand -base64 48
openssl rand -base64 32
```

Do not use the example JWT secret or the default admin password.

## Frontend environment file

Create `frontend/.env`:

```env
VITE_AUTH_API_URL=https://api.yourdomain.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxx
VITE_GOOGLE_CLIENT_ID=
```

Only the Razorpay Key ID and Google Client ID are public. Never put `RAZORPAY_KEY_SECRET`, database credentials, R2 credentials, SMTP credentials, or `JWT_SECRET` here.

## PostgreSQL setup

1. Create one PostgreSQL database.
2. Copy its host, database, username, and password into `backend/.env`.
3. Keep `DDL_AUTO=validate`.
4. Start the backend once; Flyway applies `V1` through `V4`.
5. Confirm the startup log reports successful migrations.

The migration files are:

```text
backend/src/main/resources/db/migration/V1__initial_schema.sql
backend/src/main/resources/db/migration/V2__resource_access_logs.sql
backend/src/main/resources/db/migration/V3__account_security.sql
backend/src/main/resources/db/migration/V4__pyq_exam_metadata.sql
```

## Cloudflare R2 setup

1. Open Cloudflare Dashboard → R2 → Create bucket.
2. Create a private bucket named `bytepath-resources`.
3. Create an R2 API token with Object Read & Write permission scoped only to that bucket.
4. Copy its Access Key ID and Secret Access Key.
5. Copy the endpoint in the form:

```text
https://ACCOUNT_ID.r2.cloudflarestorage.com
```

Put these values in the backend only. [Cloudflare R2 token setup](https://developers.cloudflare.com/r2/api/tokens/)

## Razorpay setup

1. Create/verify the Razorpay merchant account.
2. Switch to Live Mode.
3. Dashboard → Account & Settings → API Keys → Generate Key.
4. Put the Key ID in both backend and frontend.
5. Put the Key Secret only in `backend/.env`.
6. Create a webhook for:

```text
https://api.yourdomain.com/api/payments/razorpay/webhook
```

7. Use the same webhook secret in `RAZORPAY_WEBHOOK_SECRET`.

Razorpay API keys are mode-specific; test keys cannot process live payments. [Razorpay API key documentation](https://razorpay.com/docs/api/authentication/)

## Resend email setup

1. Create a Resend account.
2. Add and verify `yourdomain.com`.
3. Add the provider’s SPF and DKIM DNS records.
4. Create an API key.
5. Use Resend SMTP credentials in the backend environment.
6. Set `MAIL_FROM` to a verified address.

Resend currently advertises a free transactional-email tier, subject to its limits. [Resend pricing](https://resend.com/pricing?product=marketing)

## Optional OAuth setup

### Google

Create a Web OAuth client in Google Cloud Console. Add this authorized JavaScript origin:

```text
https://app.yourdomain.com
```

Set the same client ID in:

```text
VITE_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_ID
```

Google origins and redirect URIs must match exactly. [Google OAuth setup](https://developers.google.com/identity/protocols/oauth2/web-server)

### GitHub

Create an OAuth App and set the callback URL to:

```text
https://api.yourdomain.com/api/auth/github/callback
```

Set its client ID and secret in the backend only. [GitHub OAuth setup](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authenticating-to-the-rest-api-with-an-oauth-app)

## Deploy order

1. Create PostgreSQL.
2. Create the R2 bucket and token.
3. Configure Razorpay Live Mode and webhook.
4. Configure Resend SMTP and domain DNS.
5. Deploy the backend to Render with the backend environment variables.
6. Confirm `https://api.yourdomain.com/swagger-ui.html` loads.
7. Deploy the frontend with `VITE_AUTH_API_URL` and `VITE_RAZORPAY_KEY_ID`.
8. Set Cloudflare DNS for both subdomains.
9. Test registration, email verification, login, admin upload, Mid-Sem access, End-Sem payment, and PDF viewing.

## Production acceptance checklist

- [ ] Frontend opens over HTTPS.
- [ ] Backend opens over HTTPS.
- [ ] `CORS_ALLOWED_ORIGINS` contains only the real frontend origin.
- [ ] PostgreSQL uses SSL and Flyway completes successfully.
- [ ] R2 bucket is private.
- [ ] Admin can upload a PDF.
- [ ] Mid-Sem PDF opens in the protected viewer.
- [ ] End-Sem PDF remains locked before payment.
- [ ] Razorpay Live payment creates an active subscription.
- [ ] Razorpay webhook returns HTTP 200.
- [ ] Verification email arrives from the verified domain.
- [ ] Password reset email arrives.
- [ ] OCR works on a scanned PDF.
- [ ] Backups and provider billing alerts are enabled.
- [ ] `.env` files are not in Git.

## Important current limitations

- Refresh tokens are currently returned to the frontend and stored with the browser session; for stronger production security, move them to secure HttpOnly cookies.
- OCR runs during upload; a background worker is preferable for large PDFs.
- The free tiers are suitable for launch/testing but may sleep, throttle, or lack backups/SLA. Upgrade PostgreSQL and API hosting once real users depend on the service.
