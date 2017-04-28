exports.getNewMsg = (from, text) => {
  return { from, text, createdAt: new Date().toString() }
}

exports.genLocationMsg = (from, { lat, lng }) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${lat},${lng}`,
    createdAt: new Date().toString()
  }
}