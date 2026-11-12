import {cp, mkdir, rm, writeFile} from "node:fs/promises";

const config = {
    API_BASE_URL: process.env.API_BASE_URL || ""
};

await mkdir("frontEnd/public/js", {recursive: true});
await writeFile(
    "frontEnd/public/js/config.js",
    `window.APP_CONFIG = ${JSON.stringify(config)};\nwindow.apiUrl = path => \`${'${window.APP_CONFIG.API_BASE_URL.replace(/\\/$/, "")}'}${'${path}'}\`;\n`
);

await rm("public", {recursive: true, force: true});
await cp("frontEnd", "public", {recursive: true});
await rm("dist", {recursive: true, force: true});
await cp("public", "dist", {recursive: true});
