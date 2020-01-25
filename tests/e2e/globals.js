// eslint-disable-next-line no-console
module.exports = {
  abortOnNightwatchAssertionsFailure: true,

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
