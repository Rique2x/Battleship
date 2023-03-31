import dom from './modules/dom'
import Player from './modules/player'
import Ship from './modules/ship'
import obs from './modules/observer'

const game = (function () {
  const setPlayers = function () {
    const one = Player('user')
    const two = Player('computer')
    return { one, two }
  }

  const initGame = function (players) {
    const playerOne = players[0]
    const playerTwo = players[1]

    dom.startDom([elements.boardOne, elements.boardTwo])
    const one = { player: playerOne, board: elements.boardOne }
    const two = { player: playerTwo, board: elements.boardTwo }

    return { one, two }
  }

  const newShip = function (player, domboard, index, length, axis) {
    const ship = Ship(length)
    player.gameboard.placeShip(index, ship, axis)
    dom.renderShips(player.gameboard.board, domboard)
  }

  const updateDom = function () {
    dom.renderShips(players.one.gameboard.board, boards.one.board)
    dom.renderShips(players.two.gameboard.board, boards.two.board)
  }

  const elements = {
    boardOne: document.getElementById('board-one'),
    boardTwo: document.getElementById('board-two'),
  }

  const players = setPlayers()

  const boards = initGame(players)

  obs.subscribe('attack', (data) => {
    if (data[0] === players.two) {
      players.two.gameboard.receiveAttack(data[1])
    } else if (data[0] === players.one) {
      players.one.gameboard.receiveAttack(data[1])
    }
    updateDom()
  })

  return { setPlayers, boards, initGame, newShip, elements, players, updateDom }
})()

export default game

game.newShip(game.players.one, game.elements.boardOne, [2, 4], 4, 'y')
game.newShip(game.players.one, game.elements.boardOne, [2, 6], 4, 'x')

game.players.two.attack([3, 4], game.players.one)
game.players.two.attack([1, 4], game.players.one)