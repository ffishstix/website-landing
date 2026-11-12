import {cp, rm} from "node:fs/promises";

await rm("public", {recursive: true, force: true});
await cp("frontEnd", "public", {recursive: true});
await rm("dist", {recursive: true, force: true});
await cp("public", "dist", {recursive: true});
