"use strict";

const fs = require("fs-extra-promise");

console.log("Initializing MFW project, this will overwrite files in this directory!");

fs.copyAsync(__dirname + "/../template_client", "client")
.then(() => {
    return fs.copyAsync(__dirname + "/../template_server", ".");
})
.then(() => {
    console.log("Copying complete!");
    console.log("You should add this to your package.json:");
    console.log("  \"scripts\": {");
    console.log("    \"install\": \"cd client && npm install\"");
    console.log("  }");
});
