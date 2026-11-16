# Drawing mailbox

A tiny Cloudflare Worker that receives drawings from the drawing pad on
niia.design and emails them to you — the picture shows up right in the email,
with the visitor's couple of words as the subject line. Free on Cloudflare's
and Resend's free plans.

```
visitor draws → "Send to Niia" → this Worker → Resend → your inbox
```

## One-time setup (about 15 minutes)

### 1. Make a Resend account — it sends the emails

1. Sign up at **resend.com**, using the email address you want drawings sent to.
2. Go to **API Keys → Create API key**, give it "Sending access", and copy the
   key (it starts with `re_`). Keep it somewhere safe for step 3.

> Until you verify your own domain in Resend, it can only send to the email
> you signed up with. That's exactly what we want here, so no domain setup
> is needed.

### 2. Make a Cloudflare account — it runs the Worker

1. Sign up at **dash.cloudflare.com** (the free plan is enough).
2. In Terminal, from this `worker` folder, log in:

   ```bash
   cd ~/Documents/niia-design-experiment/worker
   npm install
   npx wrangler login
   ```

   A browser window opens; approve it.

### 3. Give the Worker its two secrets

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put TO_EMAIL
```

Each one asks you to paste a value: the `re_…` key from step 1, then your
email address. Secrets are stored by Cloudflare, never in the code.

### 4. Put it online

```bash
npx wrangler deploy
```

It prints the Worker's address, something like
`https://niia-drawing-mailbox.<your-name>.workers.dev`. Copy it.

### 5. Tell the site where the mailbox is

On GitHub, open the site's repo → **Settings → Secrets and variables →
Actions → Variables → New repository variable**:

- Name: `VITE_DRAWING_ENDPOINT`
- Value: the Worker address from step 4

The deploy workflow already passes it to the build, so the next deploy of
`main` turns the drawing pad from preview mode into the real thing.

To try it from your own computer first, create `.env.local` in the site folder
with `VITE_DRAWING_ENDPOINT=<the Worker address>` and restart `npm run dev`.

## Good to know

- **Who can send:** only pages on `niia.design` (and your local dev server) —
  see `ALLOWED_ORIGINS` in `wrangler.toml`.
- **Spam:** a hidden field catches simple bots. If spam ever gets through,
  Cloudflare's free rate limiting rules can cap sends per visitor.
- **Limits:** Resend's free plan covers 3,000 emails a month (100 a day);
  Cloudflare's covers 100,000 Worker requests a day.
- **Logs:** `npx wrangler tail` shows live requests if something looks off.
