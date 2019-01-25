let ITMuslim = {}

ITMuslim.localizeString = function (string) {
  if (typeof (string) !== 'string') {
    return null
  }

  const size = Object.keys(arguments).length
  for (var idx = 1; idx < size; idx++) {
    if (arguments.hasOwnProperty(idx) === false) {
      continue
    }

    string = string.replace('{' + (idx - 1) + '}', arguments[idx])
  }
  return string
}

ITMuslim.Language = {
  en: 'en',
  ru: 'ru'
}
module.exports = ITMuslim
