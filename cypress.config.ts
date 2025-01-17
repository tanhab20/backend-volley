import { defineConfig } from "cypress";
//import cypressGrep from 'cypress-grep';

export default defineConfig({
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
