/**
 * @jest-environment jsdom
 */

import dom from '../modules/dom'
import Gameboard from '../modules/gameboard'
import Ship from '../modules/ship'

describe('start dom', () => {
  const boardOne = document.createElement('div')
  boardOne.setAttribute('id', 'board-one')
  dom.startDom([boardOne])

  test('creates correct boards', () => {
    expect(boardOne.childElementCount).toBe(10)
    expect(boardOne.children[0].children.length).toBe(10)
  })
})

describe('render ships', () => {
  const boardOne = document.createElement('div')
  boardOne.setAttribute('id', 'board-one')
  dom.startDom([boardOne])

  const gameboardOne = Gameboard()
  const ship1 = Ship(5)
  gameboardOne.placeShip([0, 0], ship1, 'y')

  dom.renderShips(gameboardOne.board, boardOne)

  gameboardOne.receiveAttack([1, 0])
  gameboardOne.receiveAttack([1, 1])

  test('can place ships', () => {
    expect(boardOne.children[0].children[0].classList).toContain('ship5')
    expect(boardOne.children[2].children[0].classList).toContain('ship5')
    expect(boardOne.children[4].children[0].classList).toContain('ship5')
  })

  test('places correct ship length', () => {
    expect(boardOne.children[5].children[0].classList).not.toContain('ship5')
  })

  test('includes hits and misses', () => {
    dom.renderShips(gameboardOne.board, boardOne)
    expect(boardOne.children[1].children[0].classList).toContain('hit')
    expect(boardOne.children[1].children[1].classList).toContain('miss')
  })
})