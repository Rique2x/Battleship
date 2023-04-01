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

  const switchTurn = function () {
    turn = turn === players.one ? players.two : players.one
    elements.playerOneWrap.classList.toggle('turn')
    elements.playerTwoWrap.classList.toggle('turn')
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

  const handleAttack = function (data) {
    if (data[0] === players.two) {
      players.two.gameboard.receiveAttack(data[1])
    } else if (data[0] === players.one) {
      players.one.gameboard.receiveAttack(data[1])
    }
    updateDom()
  }

  const handleSelection = function (event) {
    const target = event.target
    const targetIndex = [+target.classList[0][1], +target.classList[0][3]]

    if (boards.two.board === event.composedPath()[2]) {
      if (turn === players.two);
      else {
        if (target.classList[1] === 'miss' || target.classList[2] === 'hit')
          console.log('already attacked')
        else {
          players.one.attack(targetIndex, players.two)
          switchTurn()
          setTimeout(() => {
            players.two.play(players.one.gameboard.board, players.one)
            switchTurn()
          }, 1000)
        }
      }
    }
  }


  const elements = {
    boardOne: document.getElementById('board-one'),
    boardTwo: document.getElementById('board-two'),
    playerOneWrap: document.getElementById('player-one-wrap'),
    playerTwoWrap: document.getElementById('player-two-wrap'),
  }

  const players = setPlayers()

  let turn = players.one

  const boards = initGame(players)

  obs.subscribe('attack', handleAttack)

  obs.subscribe('cellSelection', handleSelection)

  return { setPlayers, boards, initGame, newShip, elements, players, updateDom }
})()

export default game

game.newShip(game.players.one, game.elements.boardOne, [2, 4], 4, 'y')
game.newShip(game.players.one, game.elements.boardOne, [2, 6], 3, 'x')
game.newShip(game.players.one, game.elements.boardOne, [0, 0], 5, 'y')
game.newShip(game.players.one, game.elements.boardOne, [8, 3], 2, 'x')
game.newShip(game.players.one, game.elements.boardOne, [9, 7], 1, 'x')

game.newShip(game.players.two, game.elements.boardTwo, [2, 4], 4, 'y')
game.newShip(game.players.two, game.elements.boardTwo, [2, 6], 3, 'x')
game.newShip(game.players.two, game.elements.boardTwo, [0, 0], 5, 'y')
game.newShip(game.players.two, game.elements.boardTwo, [8, 3], 2, 'x')
game.newShip(game.players.two, game.elements.boardTwo, [9, 7], 1, 'x')