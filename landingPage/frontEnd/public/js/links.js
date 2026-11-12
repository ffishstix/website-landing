if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    document.querySelectorAll("[data-local-href]").forEach(link => {
        link.href = link.dataset.localHref;
    });
}
