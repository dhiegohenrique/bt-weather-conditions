// eslint-disable-next-line no-console
module.exports = {
  asyncHookTimeout: 600000,
  abortOnNightwatchAssertionsFailure: true,
  waitForConditionTimeout: 120000,
  retryAssertionTimeout: 60000,

  beforeEach: (browser, done) => {
    browser
      .init()
      .maximizeWindow()
      .useXpath(done)
  },

  afterEach: (browser, done) => {
    browser
      .end(done)
  }
}
