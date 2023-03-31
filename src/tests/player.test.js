import Player from '../modules/player'
import obs from '../modules/observer'

jest.mock('../modules/player')

describe('constructor', () => {
  const playerOne = Player('user')
  const playerTwo = Player('computer')

  test('initiates own gamebord', () => {
    expect(playerOne.gameboard).toBeTruthy()
  })

  test('is user or computer', () => {
    expect(playerOne.type).toBe('user')
    expect(playerTwo.type).toBe('computer')
  })
})

describe('attack', () => {
  const playerOne = Player('user')
  obs.publish.mockImplementation((name, data) => {
    return name
  })

  test('can attack', () => {
    expect(playerOne.attack).toBeTruthy()
    expect(playerOne.attack([0, 0])).toBe('attack')
  })

  test('doesnt attack out of bounds', () => {
    expect(() => playerOne.attack([0, 10])).toThrow(
      'Cannot attack outside the board!'
    )
    expect(() => playerOne.attack([-2, 9])).toThrow(
      'Cannot attack outside the board!'
    )
    expect(playerOne.attack([0, 9])).toBe('attack')
  })
})

describe('computer can play', () => {
  const playerOne = Player('user')
  const playerTwo = Player('computer')

  test('cant use play() as user', () => {
    expect(() => playerOne.play()).toThrow('Users cannot use play method!')
  })

  test('can use play() as computer', () => {
    expect(playerTwo.play(playerOne.gameboard.board)).toBe('attack')
  })
})