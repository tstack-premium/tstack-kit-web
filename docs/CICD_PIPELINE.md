# CI/CD Pipeline — GitHub Actions + Kamal Deploy

This document explains the complete deployment pipeline for `tstack-kit-web`.

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
