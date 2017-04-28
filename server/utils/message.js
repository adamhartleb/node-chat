const moment = require('moment')

exports.getNewMsg = (from, text) => {
  return { from, text, createdAt: moment().valueOf() }
}

exports.genLocationMsg = (from, { lat, lng }) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${lat},${lng}`,
    createdAt: moment().valueOf()
  }
}