"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cypress_1 = require("cypress");
//import cypressGrep from 'cypress-grep';
exports.default = (0, cypress_1.defineConfig)({
    e2e: {
        baseUrl: "https://kavolley.uber.space/api/tournaments",
        specPattern: "cypress/integration/**/*.spec.ts",
        setupNodeEvents(on, config) {
            // Plugin in Node-Setup-Funktion laden
            //cypressGrep(config)
            return config;
        },
        env: {
            grepTags: null,
        },
    },
});
