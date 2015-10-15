"use strict";

const fs = require("fs-extra-promise");

if (process.argv.length < 3) {
    console.error("Missing target folder name (ex. client)");
    process.exit(255);
}

console.log("Copying MFW client template to " + process.argv[2]);

fs.copyAsync(__dirname + "/../template", process.argv[2])
.then(function() {
    console.log("Copying complete!");
    console.log("You should add this to your package.json:");
    console.log("  \"scripts\": {");
    console.log("    \"install\": \"cd " + process.argv[2] + " && npm install\"");
    console.log("  }");
});
