import {mkdir, writeFile} from "node:fs/promises";

const config = {
    API_BASE_URL: process.env.API_BASE_URL || ""
};

await mkdir("landingPage/frontEnd/public/js", {recursive: true});
await writeFile(
    "landingPage/frontEnd/public/js/config.js",
    `window.APP_CONFIG = ${JSON.stringify(config)};\nwindow.apiUrl = path => \`${'${window.APP_CONFIG.API_BASE_URL.replace(/\\/$/, "")}'}${'${path}'}\`;\n`
);
