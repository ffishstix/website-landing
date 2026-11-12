const publicFiles = new Set([
    "/favicon.svg",
    "/public/landing.css",
    "/public/not-found.css",
    "/public/js/constants.js",
    "/public/js/state.js",
    "/public/js/status.js",
    "/public/js/links.js",
    "/public/js/init.js"
]);

function looksLikeBotProbe(pathname) {
    let path = pathname.toLowerCase();
    try { path = decodeURIComponent(path); } catch { /* Keep the original path. */ }
    return /(?:^|\/)(?:\.env(?:\.|\/|$)|\.git(?:\/|$)|\.ds_store$|wp-admin(?:\/|$)|wp-content(?:\/|$)|wp-includes(?:\/|$)|wp-login\.php$|xmlrpc\.php$|phpmyadmin(?:\/|$)|pma(?:\/|$)|cgi-bin(?:\/|$)|vendor\/phpunit(?:\/|$)|actuator(?:\/|$)|server-status$|config\.php$|adminer(?:\.php|\/|$)|boaform(?:\/|$)|hnapi?1(?:\/|$)|solr(?:\/|$)|admin(?:\/|$))/.test(path);
}

function missingPage(bot) {
    const title = bot ? "Nice try bot" : "Page not found";
    const detail = bot
        ? "There is nothing useful for you at this address."
        : "That page does not exist here. Head back to the projects page and choose where to go next.";
    return new Response(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${title} | Fishstix</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="stylesheet" href="/public/not-found.css"></head>
<body><main class="missing"><a class="brand" href="/">FS <span>Fishstix Projects</span></a>
<div class="code">404</div><h1>${title}</h1><p>${detail}</p>
<a class="home" href="/">Back to the homepage</a></main></body></html>`, {
        status: 404,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=300",
            "Content-Security-Policy": "default-src 'none'; style-src 'self'; base-uri 'none'; form-action 'none'",
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "no-referrer"
        }
    });
}

export async function onRequest(context) {
    const url = new URL(context.request.url);
    if (url.hostname.toLowerCase() === "www.fishstix.uk") {
        url.hostname = "fishstix.uk";
        return Response.redirect(url.toString(), 308);
    }
    if (["GET", "HEAD"].includes(context.request.method) &&
        (url.pathname === "/" || url.pathname === "/api/status" || publicFiles.has(url.pathname))) {
        return context.next();
    }
    return missingPage(looksLikeBotProbe(url.pathname));
}
