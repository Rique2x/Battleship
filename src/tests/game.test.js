import setPlayers from '../game'

test('can create players', () => {
  const players = setPlayers()
  expect(players[0]).toContain('section')
})