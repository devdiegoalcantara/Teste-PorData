require('dotenv').config();

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://github.com',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    trashAssetsBeforeRuns: true,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    chromeWebSecurity: true,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/results',
      overwrite: false,
      html: true,
      json: true,
      timestamp: 'mmddyyyy_HHMMss'
    },
    setupNodeEvents(on, config) {
      config.env.GITHUB_EMAIL = process.env.GITHUB_EMAIL;
      config.env.GITHUB_PASSWORD = process.env.GITHUB_PASSWORD;
      config.env.GITHUB_USERNAME = process.env.GITHUB_USERNAME;
      
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });
      
      return config;
    },
  },
});
