const expect = require('expect')
const { getNewMsg } = require('./message')

describe('Messaging', () => {
  it('should generate the proper message', () => {
    const from = 'Adam'
    const text = 'Hello, World!'
    const result = getNewMsg(from, text)

    expect(result).toInclude({ from, text })
    expect(result.createdAt).toBeA('string')
  })
})