# KitchenWCCS Landing

The project landing page and its status service, split from the original monorepo.

## Cloudflare Pages

- Root directory: `landingPage`
- Build command: `npm run build`
- Build output directory: `public`

The `functions/` directory serves `/api/status` and the custom 404 and bot-probe responses.

The legacy Node status service remains available for local use. The hosted page checks the Capital Rift, Kitchen, Admin, and Battery Watch sites through its Pages Function.
