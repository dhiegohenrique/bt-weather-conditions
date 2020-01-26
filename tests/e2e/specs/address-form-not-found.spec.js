module.exports = {
  beforeEach: (browser) => {
    browser
      .refresh()
  },

  'Should show a toast when address not found': async function (browser) {
    const message = 'Não foi encontrada uma localização com os dados informados.'
    const xpath = `//div[contains(@class, "toasted-container")]//div[contains(@class, "toasted") and contains(text(), "${message}")]//i[contains(text(), "info")]`

    await browser.sendKeys('//*[@id="cep"]//input', '11111111')
    await browser.click('//*[@id="search"]')
    await browser.waitForLoadingModal()
    await browser.waitForElementVisible(xpath)
  }
}
