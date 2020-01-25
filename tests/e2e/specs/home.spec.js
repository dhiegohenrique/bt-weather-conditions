module.exports = {
  beforeEach: (browser) => {
    browser
      .refresh()
  },

  'Should show logo': (browser) => {
    const xpath = '//*[@id="logo"]'

    browser
      .waitForElementVisible(xpath)
      .expect.element(xpath).to.be.visible
  }
}
