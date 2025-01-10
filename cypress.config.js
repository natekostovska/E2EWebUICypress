const { defineConfig } = require("cypress");
require('dotenv').config();  // Ensure this line is at the top


module.exports = defineConfig({
  projectId: 'zaitqe',
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: true,
  experimentalWebKitSupport: true,
  env: {
    username: process.env.username,
    password: process.env.password,
    apiUrl: 'https://conduit-api.bondaracademy.com'
  },
  retries: {
    runMode: 2,
    openMode: 0
  },
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  e2e: {
    baseUrl: 'http://localhost:4200',
    excludeSpecPattern: ['**/1-getting-started', '**/2-advanced-examples'], //exclude this two folders to be shown when running tests
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      const username = config.env.username
      const password = config.env.password
      if (!password) {
        throw new Error('missing PASSWORD environment variable')
      }

      config.env = { username, password }
      return config
    },
  },
});



require('@applitools/eyes-cypress')(module);
