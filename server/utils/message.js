exports.getNewMsg = (from, text) => {
  return { from, text, createdAt: new Date().toString() }
}