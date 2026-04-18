const fs = require('fs');
const path = require('path');

const baseDir = "c:\\Users\\Admin\\Desktop\\Kuyén\\zonaArchivo";

let indexHtml = fs.readFileSync(path.join(baseDir, "index.html"), "utf-8");

const loreHtml = fs.readFileSync(path.join(baseDir, "pages", "lore.html"), "utf-8");
const facHtml = fs.readFileSync(path.join(baseDir, "pages", "factions.html"), "utf-8");
const entHtml = fs.readFileSync(path.join(baseDir, "pages", "entities.html"), "utf-8");
const monHtml = fs.readFileSync(path.join(baseDir, "pages", "monitor.html"), "utf-8");

indexHtml = indexHtml.replace("<!-- Lore -->", loreHtml);
indexHtml = indexHtml.replace("<!-- Factions -->", facHtml);
indexHtml = indexHtml.replace("<!-- Entities -->", entHtml);
indexHtml = indexHtml.replace("<!-- Monitor -->", monHtml);

fs.writeFileSync(path.join(baseDir, "index.html"), indexHtml, "utf-8");

console.log("Pages injected successfully into index.html via Node.js");
