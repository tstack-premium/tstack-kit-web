# CI/CD Pipeline — GitHub Actions + Kamal Deploy

This document explains the complete deployment pipeline for `tstack-kit-web`.

---

## Domain Roadmap

| Environment | Domain | Server | Status |
|------------|--------|--------|--------|
| **Production** (future) | `www.tstackkit.dev` | New dedicated server (TBD) | Planned ~3 months |
| **Staging** (current → future) | `tstack.desinghrajan.in` | `13.126.26.123` (AWS Lightsail, Mumbai) | Live ✅ |

**Current state:** `tstack.desinghrajan.in` is a temporary production domain until `tstackkit.dev` is purchased and configured. Once that happens, this becomes the staging environment and a `config/deploy.staging.yml` will be added (see [Future: Production Migration](#future-production-migration-to-wwwtstackitdev) below).

---

## Architecture

```
GitHub (push to main)
    → GitHub Actions (runner)
        → Docker build (multi-stage: Node 22 + nginx)
        → Push image to Docker Hub
        → SSH into Lightsail server
        → Kamal pulls image & starts container
        → kamal-proxy routes tstack.desinghrajan.in → container:8000
```

---

## Files Involved

| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | GitHub Actions workflow — triggers deploy on push to `main` |
| `config/deploy.yml` | Kamal config — server IP, domain, registry, healthcheck |
| `.kamal/secrets` | Local Kamal secrets (gitignored, for manual deploys) |
| `Dockerfile` | Multi-stage build: Node 22 builds Vite app, nginx:alpine serves it |
| `nginx.conf` | Nginx config inside container: SPA fallback, `/health`, gzip, caching |
| `.dockerignore` | Excludes node_modules, dist, .git from Docker build context |

---

## GitHub Environment Setup

### Environment Name: `tstack-kit-web-prod`

Go to: **GitHub Repo → Settings → Environments → tstack-kit-web-prod**

### Required Secrets

| Secret Name | Value | Description |
|------------|-------|-------------|
| `DEPLOY_SSH_KEY` | Contents of `~/.ssh/id_ed25519` | Private SSH key to access the Lightsail server. Must include the full key including `-----BEGIN/END OPENSSH PRIVATE KEY-----` lines. |
| `KAMAL_SECRETS` | `KAMAL_REGISTRY_PASSWORD=dckr_pat_xxxxx` | Docker Hub personal access token. **Must include the key name** `KAMAL_REGISTRY_PASSWORD=` prefix — not just the token value alone. |

### How to set secrets

1. Go to `https://github.com/<org>/<repo>/settings/environments`
2. Click on the environment (e.g., `tstack-kit-web-prod`)
3. Under **Environment secrets**, click **Add environment secret**
4. Enter the **Name** and **Value** exactly as shown above
5. Click **Add secret**

### Common mistakes

- **KAMAL_SECRETS**: Setting only the token value (`dckr_pat_xxx`) without the `KAMAL_REGISTRY_PASSWORD=` prefix. Kamal reads this file as a dotenv file and needs `KEY=VALUE` format.
- **DEPLOY_SSH_KEY**: Missing the `-----BEGIN OPENSSH PRIVATE KEY-----` / `-----END OPENSSH PRIVATE KEY-----` header/footer lines.
- **Line breaks**: Ensure `KAMAL_SECRETS` is on a single line with no accidental line breaks in the middle of the token.

---

## Workflow Steps Explained

```yaml
deploy-production:
  runs-on: ubuntu-latest
  environment: tstack-kit-web-prod   # ← pulls secrets from this environment
```

### 1. Checkout

Clones the repo on the GitHub Actions runner.

### 2. Setup SSH

Writes the `DEPLOY_SSH_KEY` to `~/.ssh/id_ed25519` on the runner so Kamal can SSH into the Lightsail server (`13.126.26.123`). Disables strict host key checking to avoid interactive prompts.

### 3. Setup Ruby + Install Kamal

Kamal is a Ruby gem. Installs Ruby 3.3 and then `gem install kamal`.

### 4. Write Kamal Secrets

Writes the `KAMAL_SECRETS` GitHub secret to `.kamal/secrets` — this is the file Kamal reads to resolve secret references in `config/deploy.yml` (like `KAMAL_REGISTRY_PASSWORD`).

### 5. Deploy Production

Runs `kamal deploy -c config/deploy.yml` which:

1. Builds the Docker image on the runner using `docker buildx`
2. Pushes the image to Docker Hub (`desinghrajan/tstack-kit-web`)
3. SSHes into `13.126.26.123` as `ubuntu`
4. Pulls the new image on the server
5. Starts a new container
6. Waits for `/health` to return 200
7. kamal-proxy switches traffic to the new container
8. Stops the old container (keeps last 2 via `retain_containers: 2`)

---

## Kamal Config Explained (`config/deploy.yml`)

```yaml
service: tstack-kit-web              # Unique service name (won't conflict with other services on same server)
image: desinghrajan/tstack-kit-web   # Docker Hub image path

servers:
  web:
    hosts:
      - 13.126.26.123                # AWS Lightsail server IP

registry:
  username: desinghrajan             # Docker Hub username
  password:
    - KAMAL_REGISTRY_PASSWORD        # Resolved from .kamal/secrets

ssh:
  user: ubuntu                       # Lightsail default SSH user

proxy:
  host: tstack.desinghrajan.in       # Domain routed by kamal-proxy
  ssl: true                          # Auto SSL via Let's Encrypt
  app_port: 8000                     # Container port nginx listens on
  healthcheck:
    path: /health                    # Endpoint kamal checks before switching traffic
    interval: 10
    timeout: 60

builder:
  arch: amd64                        # Build for x86_64 (Lightsail architecture)

retain_containers: 2                 # Keep last 2 containers for quick rollback
```

---

## Docker Image Explained

### Stage 1: Builder (Node 22 Alpine)

- Installs npm dependencies (`npm ci`)
- Runs `npm run build` (Vite production build)
- Outputs static files to `dist/`

### Stage 2: Server (nginx Alpine)

- Copies `nginx.conf` for SPA routing and health endpoint
- Copies `dist/` from builder stage
- Listens on port 8000 (IPv4 and IPv6)
- Serves `/health` returning `200 ok` for Kamal healthcheck
- Serves `/assets/*` with 1-year cache (Vite hashes filenames)
- Falls back to `index.html` for all routes (SPA support)

---

## Manual Deploy (from local machine)

```bash
# First time only — if kamal-proxy is NOT already on the server
# WARNING: Do NOT run this if other services are already running on the server!
# kamal setup -c config/deploy.yml

# Regular deploy
kamal deploy -c config/deploy.yml

# Check status
kamal details -c config/deploy.yml

# View logs
kamal app logs -c config/deploy.yml

# Rollback to previous version
kamal rollback -c config/deploy.yml
```

---

## DNS Setup

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | tstack | 13.126.26.123 | 600s |

Set this in your domain provider (GoDaddy) for `desinghrajan.in`.

---

## Known Issues Encountered During Initial Lightsail Deployment

These were real issues hit during the first deploy on **March 2, 2026**. Documented here to save time if this ever needs to be rebuilt from scratch.

### 1. `KAMAL_SECRETS` — wrong format in GitHub secret

**Error:**
```
ERROR (Kamal::ConfigurationError): Secret 'KAMAL_REGISTRY_PASSWORD' not found in .kamal/secrets
```

**Cause:** The `KAMAL_SECRETS` environment secret in GitHub was set to just the Docker Hub token value (`dckr_pat_xxx`) without the key name prefix.

**Fix:** The value must be a dotenv-formatted line:
```
KAMAL_REGISTRY_PASSWORD=dckr_pat_xxx
```
Not just `dckr_pat_xxx` alone. Kamal parses `.kamal/secrets` as a dotenv file and looks for `KEY=VALUE` pairs.

---

### 2. Container unhealthy — nginx healthcheck IPv6 issue

**Error:**
```
wget: can't connect to remote host: Connection refused
```
Container showed `(unhealthy)` despite nginx running correctly.

**Cause:** The Dockerfile healthcheck used `localhost` which `busybox wget` on Alpine resolves to `::1` (IPv6). But nginx was only bound to `0.0.0.0` (IPv4), so `::1:8000` was refused.

**Fix (applied in Dockerfile):**
```dockerfile
# Wrong — resolves to ::1 on Alpine busybox
CMD wget -qO- http://localhost:8000/health || exit 1

# Correct — explicit IPv4 loopback
CMD wget -qO- http://127.0.0.1:8000/health || exit 1
```

Also added `listen [::]:8000;` in `nginx.conf` to listen on both IPv4 and IPv6 as a belt-and-suspenders fix.

---

### 3. `ERR_SSL_PROTOCOL_ERROR` in browser despite successful deploy

**Cause:** DNS for `tstack.desinghrajan.in` was still pointing to the old IP (`139.84.144.43`) in GoDaddy. The browser was hitting the wrong server which had no SSL cert for that domain.

**Fix:** Updated the GoDaddy A record for `tstack` from `139.84.144.43` → `13.126.26.123`. kamal-proxy auto-issues the Let's Encrypt cert on the first real HTTPS request once DNS propagates.

---

### 4. Never run `kamal setup` on a shared server

This Lightsail server also hosts `sc-store`, `sc-api`, and `sc-admin-ui` (Surya's Cookware). Running `kamal setup` would restart kamal-proxy and briefly drop all running services.

**Rule:** Always use `kamal deploy -c config/deploy.yml` — never `kamal setup`.

---

## Future: Production Migration to `www.tstackkit.dev`

When `tstackkit.dev` is purchased (~3 months), this is the migration plan:

### Step 1 — Create `config/deploy.staging.yml`

Rename or copy the current `config/deploy.yml` to `config/deploy.staging.yml` pointing to `tstack.desinghrajan.in` (the current domain becomes staging):

```yaml
service: tstack-kit-web
image: desinghrajan/tstack-kit-web

servers:
  web:
    hosts:
      - 13.126.26.123       # same Lightsail server, shared with sc-* services

registry:
  username: desinghrajan
  password:
    - KAMAL_REGISTRY_PASSWORD

ssh:
  user: ubuntu

proxy:
  host: tstack.desinghrajan.in   # ← becomes staging domain
  ssl: true
  app_port: 8000
  healthcheck:
    path: /health
    interval: 10
    timeout: 60

builder:
  arch: amd64

retain_containers: 2
```

### Step 2 — Create `config/deploy.yml` for production

Point to the new dedicated production server and `www.tstackkit.dev`:

```yaml
service: tstack-kit-web
image: desinghrajan/tstack-kit-web

servers:
  web:
    hosts:
      - <NEW_PRODUCTION_SERVER_IP>   # ← new dedicated server

registry:
  username: desinghrajan
  password:
    - KAMAL_REGISTRY_PASSWORD

ssh:
  user: ubuntu

proxy:
  host: www.tstackkit.dev,tstackkit.dev   # ← production domain + apex redirect
  ssl: true
  app_port: 8000
  healthcheck:
    path: /health
    interval: 10
    timeout: 60

builder:
  arch: amd64

retain_containers: 2
```

### Step 3 — Update GitHub Actions workflow

Add a `deploy-staging` job triggered by `staging` branch, similar to how `sc-store` handles it:

```yaml
on:
  push:
    branches:
      - main      # → production (www.tstackkit.dev)
      - staging   # → staging (tstack.desinghrajan.in)

jobs:
  deploy-production:
    if: github.ref == 'refs/heads/main'
    environment: tstack-kit-web-prod
    # ... deploy with config/deploy.yml

  deploy-staging:
    if: github.ref == 'refs/heads/staging'
    environment: tstack-kit-web-staging
    # ... deploy with config/deploy.staging.yml
```

### Step 4 — GitHub Environment secrets

Create a new `tstack-kit-web-staging` environment in GitHub with the same `DEPLOY_SSH_KEY` and `KAMAL_SECRETS` values (same server, same Docker Hub token).

### Step 5 — DNS

In the `tstackkit.dev` domain registrar:
| Type | Name | Value |
|------|------|-------|
| A | @ | `<NEW_PRODUCTION_SERVER_IP>` |
| A | www | `<NEW_PRODUCTION_SERVER_IP>` |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Secret 'KAMAL_REGISTRY_PASSWORD' not found` | `KAMAL_SECRETS` must be `KAMAL_REGISTRY_PASSWORD=<token>` — not just the token alone. See [issue #1](#1-kamal_secrets--wrong-format-in-github-secret) above. |
| Container shows `(unhealthy)` despite nginx running | Use `127.0.0.1` not `localhost` in healthcheck. See [issue #2](#2-container-unhealthy--nginx-healthcheck-ipv6-issue) above. |
| `ERR_SSL_PROTOCOL_ERROR` in browser | DNS not propagated or pointing to wrong IP. See [issue #3](#3-err_ssl_protocol_error-in-browser-despite-successful-deploy) above. |
| SSL cert never issued | kamal-proxy issues cert on first real HTTPS request. Ensure DNS is correct and port 443 is open in Lightsail firewall. |
| SSH connection refused | Verify `DEPLOY_SSH_KEY` is the full private key including `-----BEGIN/END-----` lines. |
| Existing sc-* services disrupted | Never run `kamal setup`. See [issue #4](#4-never-run-kamal-setup-on-a-shared-server) above. |


```
GitHub (push to main)
    → GitHub Actions (runner)
        → Docker build (multi-stage: Node 22 + nginx)
        → Push image to Docker Hub
        → SSH into Lightsail server
        → Kamal pulls image & starts container
        → kamal-proxy routes tstack.desinghrajan.in → container:8000
```

---

## Files Involved

| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | GitHub Actions workflow — triggers deploy on push to `main` |
| `config/deploy.yml` | Kamal config — server IP, domain, registry, healthcheck |
| `.kamal/secrets` | Local Kamal secrets (gitignored, for manual deploys) |
| `Dockerfile` | Multi-stage build: Node 22 builds Vite app, nginx:alpine serves it |
| `nginx.conf` | Nginx config inside container: SPA fallback, `/health`, gzip, caching |
| `.dockerignore` | Excludes node_modules, dist, .git from Docker build context |

---

## GitHub Environment Setup

### Environment Name: `tstack-kit-web-prod`

Go to: **GitHub Repo → Settings → Environments → tstack-kit-web-prod**

### Required Secrets

| Secret Name | Value | Description |
|------------|-------|-------------|
| `DEPLOY_SSH_KEY` | Contents of `~/.ssh/id_ed25519` | Private SSH key to access the Lightsail server. Must include the full key including `-----BEGIN/END OPENSSH PRIVATE KEY-----` lines. |
| `KAMAL_SECRETS` | `KAMAL_REGISTRY_PASSWORD=dckr_pat_xxxxx` | Docker Hub personal access token. **Must include the key name** `KAMAL_REGISTRY_PASSWORD=` prefix — not just the token value alone. |

### How to set secrets

1. Go to `https://github.com/<org>/<repo>/settings/environments`
2. Click on the environment (e.g., `tstack-kit-web-prod`)
3. Under **Environment secrets**, click **Add environment secret**
4. Enter the **Name** and **Value** exactly as shown above
5. Click **Add secret**

### Common mistakes

- **KAMAL_SECRETS**: Setting only the token value (`dckr_pat_xxx`) without the `KAMAL_REGISTRY_PASSWORD=` prefix. Kamal reads this file as a dotenv file and needs `KEY=VALUE` format.
- **DEPLOY_SSH_KEY**: Missing the `-----BEGIN OPENSSH PRIVATE KEY-----` / `-----END OPENSSH PRIVATE KEY-----` header/footer lines.
- **Line breaks**: Ensure `KAMAL_SECRETS` is on a single line with no accidental line breaks in the middle of the token.

---

## Workflow Steps Explained

```yaml
deploy-production:
  runs-on: ubuntu-latest
  environment: tstack-kit-web-prod   # ← pulls secrets from this environment
```

### 1. Checkout

Clones the repo on the GitHub Actions runner.

### 2. Setup SSH

Writes the `DEPLOY_SSH_KEY` to `~/.ssh/id_ed25519` on the runner so Kamal can SSH into the Lightsail server (`13.126.26.123`). Disables strict host key checking to avoid interactive prompts.

### 3. Setup Ruby + Install Kamal

Kamal is a Ruby gem. Installs Ruby 3.3 and then `gem install kamal`.

### 4. Write Kamal Secrets

Writes the `KAMAL_SECRETS` GitHub secret to `.kamal/secrets` — this is the file Kamal reads to resolve secret references in `config/deploy.yml` (like `KAMAL_REGISTRY_PASSWORD`).

### 5. Deploy Production

Runs `kamal deploy -c config/deploy.yml` which:

1. Builds the Docker image on the runner using `docker buildx`
2. Pushes the image to Docker Hub (`desinghrajan/tstack-kit-web`)
3. SSHes into `13.126.26.123` as `ubuntu`
4. Pulls the new image on the server
5. Starts a new container
6. Waits for `/health` to return 200
7. kamal-proxy switches traffic to the new container
8. Stops the old container (keeps last 2 via `retain_containers: 2`)

---

## Kamal Config Explained (`config/deploy.yml`)

```yaml
service: tstack-kit-web              # Unique service name (won't conflict with other services on same server)
image: desinghrajan/tstack-kit-web   # Docker Hub image path

servers:
  web:
    hosts:
      - 13.126.26.123                # AWS Lightsail server IP

registry:
  username: desinghrajan             # Docker Hub username
  password:
    - KAMAL_REGISTRY_PASSWORD        # Resolved from .kamal/secrets

ssh:
  user: ubuntu                       # Lightsail default SSH user

proxy:
  host: tstack.desinghrajan.in       # Domain routed by kamal-proxy
  ssl: true                          # Auto SSL via Let's Encrypt
  app_port: 8000                     # Container port nginx listens on
  healthcheck:
    path: /health                    # Endpoint kamal checks before switching traffic
    interval: 10
    timeout: 60

builder:
  arch: amd64                        # Build for x86_64 (Lightsail architecture)

retain_containers: 2                 # Keep last 2 containers for quick rollback
```

---

## Docker Image Explained

### Stage 1: Builder (Node 22 Alpine)

- Installs npm dependencies (`npm ci`)
- Runs `npm run build` (Vite production build)
- Outputs static files to `dist/`

### Stage 2: Server (nginx Alpine)

- Copies `nginx.conf` for SPA routing and health endpoint
- Copies `dist/` from builder stage
- Listens on port 8000
- Serves `/health` returning `200 ok` for Kamal healthcheck
- Serves `/assets/*` with 1-year cache (Vite hashes filenames)
- Falls back to `index.html` for all routes (SPA support)

---

## Manual Deploy (from local machine)

```bash
# First time only — if kamal-proxy is NOT already on the server
# WARNING: Do NOT run this if other services are already running on the server!
# kamal setup -c config/deploy.yml

# Regular deploy
kamal deploy -c config/deploy.yml

# Check status
kamal details -c config/deploy.yml

# View logs
kamal app logs -c config/deploy.yml

# Rollback to previous version
kamal rollback -c config/deploy.yml
```

---

## DNS Setup

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | tstack | 13.126.26.123 | 600s |

Set this in your domain provider (GoDaddy) for `desinghrajan.in`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Secret 'KAMAL_REGISTRY_PASSWORD' not found` | Check `KAMAL_SECRETS` GitHub secret has `KAMAL_REGISTRY_PASSWORD=<token>` format (not just the token) |
| SSH connection refused | Verify `DEPLOY_SSH_KEY` is set correctly with full private key content |
| Health check timeout | SSH into server, run `docker logs <container>` to check nginx startup |
| SSL not working | Ensure DNS A record points to `13.126.26.123` and has propagated |
| Existing services disrupted | Never run `kamal setup` on a server with running services — use `kamal deploy` only |
