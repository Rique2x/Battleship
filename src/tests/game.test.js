/**
 * @jest-environment jsdom
 */

import game from '../game'
import dom from '../modules/dom'

const players = game.setPlayers()

test('can create players', () => {
  expect(players[0].type).toBe('user')
  expect(typeof players[1]).toBe('object')
  expect(players[1].type).toBe('computer')
})
test('can create and place ships on dom', () => {
  const boardOne = document.createElement('div')
  boardOne.setAttribute('id', 'board-one')
  dom.startDom([boardOne])

  game.newShip(players[0], boardOne, [0, 0], 5, 'x')

  console.log(boardOne)
  expect(boardOne.children[0].children[1].classList).toContain('ship5')
  expect(boardOne.children[0].children[4].classList).toContain('ship5')

  expect(players[0].gameboard.board[0][1].section.status).toBe('ok')
})