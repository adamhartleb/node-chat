const expect = require('expect')
const { getNewMsg, genLocationMsg } = require('./message')

describe('Generate Message', () => {
  it('should generate the proper message', () => {
    const from = 'Adam'
    const text = 'Hello, World!'
    const result = getNewMsg(from, text)

    expect(result).toInclude({ from, text })
    expect(result.createdAt).toBeA('number')
  })
  it('should generate the proper location', () => {
    const from = 'Admin'
    const location = { lat: 49.104, lng: -122.66 }
    const result = genLocationMsg(from, location)

    expect(result).toInclude({ from })
    expect(result.url).toBeA('string').toInclude(location.lat)
    expect(result.createdAt).toBeA('number')
  })
})

