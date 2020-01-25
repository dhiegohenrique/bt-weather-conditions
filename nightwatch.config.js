const path = require('path')

module.exports = {
  globals_path: `${path.join(process.cwd(), 'tests/e2e/globals.js')}`,
  test_settings: {
    chrome: {
      desiredCapabilities: {
        chromeOptions: {
          args: [
            // 'headless',
            '--no-sandbox',
            '--lang=pt-br',
            '--incognito',
            '--enable-logging',
            '--error-console',
            '--trace-to-console',
            '--disable-gpu',
            '--disable-extensions',
            '--disable-dev-shm-usage'
          ]
        }
      }
    },
  }
}
