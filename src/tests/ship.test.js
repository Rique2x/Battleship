import { Ship } from './index.js'

test('ship has correct length', () => {
  const ship = Ship(4)
  const shortship = Ship(0)
  const longship = Ship(7)
  expect(ship.length).toBe(4)
  expect(shortship.length).toBe(1)
  expect(longship.length).toBe(5)
})
test('body is correct length', () => {
  const ship = Ship(5)
  expect(ship.body.length).toBe(5)
})
test('body section has correct props', () => {
  const ship = Ship(2)
  expect(ship.body[0].status).toBe('ok')
})
test('gets hit', () => {
  const ship = Ship(4)
  ship.hit(2)
  expect(ship.body[2].status).toBe('hit')
})
test('can sink', () => {
  const ship = Ship(1)
  ship.hit(0)
  expect(ship.isSunk()).toBe(true)
})
test('will sink only if all hit', () => {
  const ship = Ship(3)
  ship.hit(1)
  ship.hit(0)
  expect(ship.isSunk()).toBe(false)
})