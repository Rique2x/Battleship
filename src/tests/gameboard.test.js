import Gameboard from '../modules/gameboard'
// import Ship from './ship'

const mockShip = jest.fn((n) => {
  const body = []
  while (n > 0) {
    body.push({ status: 'ok' })
    n--
  }
  const isSunk = jest.fn(() => {
    return true
  })
  return { body, isSunk }
})

test('contains board', () => {
  const gameboard = Gameboard()
  expect(typeof gameboard.board).toBe('object')
  expect(gameboard.board.length).toBe(10)
  expect(gameboard.board.every((x) => x.length === 10)).toBe(true)
})

test('places ships default axis (X)', () => {
  const myShip = mockShip(2)
  const gameboard = Gameboard()

  gameboard.placeShip([1, 4], myShip)
  expect(gameboard.board[1][4]).toEqual({
    ship: myShip,
    section: myShip.body[0],
  })
  expect(gameboard.board[1][5]).toEqual({
    ship: myShip,
    section: myShip.body[1],
  })
})

test('places ships specified axis (Y)', () => {
  const myShip = mockShip(3)
  const gameboard = Gameboard()

  gameboard.placeShip([7, 7], myShip, 'y')
  expect(gameboard.board[7][7]).toEqual({
    ship: myShip,
    section: myShip.body[0],
  })
  expect(gameboard.board[8][7]).toEqual({
    ship: myShip,
    section: myShip.body[1],
  })
})

test('wont place ships outside bounds (direct)', () => {
  const myShip = mockShip(5)
  const gameboard = Gameboard()

  expect(() => gameboard.placeShip([10, 0], myShip, 'y')).toThrow(
    'Cannot place ship outside board bounds!'
  )
  expect(() => gameboard.placeShip([7, -1], myShip, 'x')).toThrow(
    'Cannot place ship outside board bounds!'
  )
})

test('wont place ships outside bounds (indirect)', () => {
  const myShip = mockShip(4)
  const gameboard = Gameboard()

  expect(() => gameboard.placeShip([1, 8], myShip, 'x')).toThrow(
    'Ship is too big for this position!'
  )
  expect(() => gameboard.placeShip([8, 8], myShip, 'y')).toThrow(
    'Ship is too big for this position!'
  )
})

describe('occupied space', () => {
  const gameboard = Gameboard()
  const shipOne = mockShip(3)
  const shipTwo = mockShip(3)
  const shipThree = mockShip(3)

  test('wont place ship on ocupied space (direct)', () => {
    gameboard.placeShip([0, 0], shipOne, 'y')
    expect(() => gameboard.placeShip([2, 0], shipTwo, 'x')).toThrow(
      'Space already has a ship!'
    )
    expect(() => gameboard.placeShip([1, 0], shipThree, 'y')).toThrow(
      'Space already has a ship!'
    )
  })

  test('wont place ship on ocupied space (indirect)', () => {
    gameboard.placeShip([1, 5], shipOne, 'y')
    expect(() => gameboard.placeShip([2, 3], shipTwo, 'x')).toThrow(
      'Space already has a ship!'
    )
    expect(() => gameboard.placeShip([0, 5], shipThree, 'y')).toThrow(
      'Space already has a ship!'
    )
  })
})

test('can receive attack (no hit)', () => {
  const gameboard = Gameboard()
  gameboard.receiveAttack([2, 4])
  gameboard.receiveAttack([0, 9])

  expect(gameboard.board[2][4]).toBe(0)
  expect(gameboard.board[0][9]).toBe(0)
})

test('can receive attack (hit)', () => {
  const ship = mockShip(5)
  const gameboard = Gameboard()
  gameboard.placeShip([1, 1], ship, 'x')
  gameboard.receiveAttack([1, 2])

  expect(gameboard.board[1][1].section.status).toBe('ok')
  expect(gameboard.board[1][2].section.status).toBe('hit')
  expect(ship.body[0].status).toBe('ok')
  expect(ship.body[1].status).toBe('hit')
})

describe('tracks ships', () => {
  const gameboard = Gameboard()
  const shipOne = mockShip(3)
  const shipTwo = mockShip(2)
  const shipThree = mockShip(5)

  gameboard.placeShip([0, 0], shipThree, 'y')
  gameboard.placeShip([0, 1], shipOne)
  gameboard.placeShip([7, 4], shipTwo, 'y')

  test('tracks all ships', () => {
    expect(gameboard.ships).toContain(shipOne)
    expect(gameboard.ships).toContain(shipTwo)
    expect(gameboard.ships).toContain(shipThree)
  })

  test('tracks ships sunk status', () => {
    gameboard.receiveAttack([7, 4])
    gameboard.receiveAttack([8, 4])

    expect(gameboard.ships[1].isSunk()).toBe(true)
  })
})