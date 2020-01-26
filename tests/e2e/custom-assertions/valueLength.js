exports.assertion = function (selector, length) {
  this.message = `Testing if element ${selector} has value length: ${length}`
  this.expected = length

  this.pass = function (value) {
    return value === this.expected
  }

  this.value = function (result) {
    return result.value.length
  }

  this.command = function (callback) {
    return this.api.getValue(selector, callback)
  }
}
