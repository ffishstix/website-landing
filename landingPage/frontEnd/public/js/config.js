window.APP_CONFIG = {"API_BASE_URL":""};
window.apiUrl = path => `${window.APP_CONFIG.API_BASE_URL.replace(/\/$/, "")}${path}`;
