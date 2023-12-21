import { defineConfig } from "cypress";
const path = require('path')
const dotenv = require('dotenv')
const envLocal = dotenv.config({ path: path.resolve(process.cwd(), '.env') }).parsed;

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
    experimentalStudio: true
  },
  env: {
    ...envLocal
  }
});

console.log(envLocal);
