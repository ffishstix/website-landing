# KitchenWCCS Landing

The project landing page and its status service, split from the original monorepo.

## Cloudflare Pages

- Root directory: `landingPage`
- Build command: `npm run build`
- Build output directory: `public`
- Environment variable: `API_BASE_URL` for the landing status API origin.
- Backend environment variable: `CORS_ORIGIN` set to the deployed Pages URL.

The backend is included for local or separate Node hosting. Cloudflare Pages serves the static frontend; it does not run the Express service. Set `API_BASE_URL` to the public landing backend origin when deploying the page separately. Leave it empty when the backend is served from the same origin.
