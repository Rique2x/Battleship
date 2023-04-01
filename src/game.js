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
    const playerOne = players.one
    const playerTwo = players.two

    dom.startDom([elements.boardOne, elements.boardTwo])
    const one = { player: playerOne, board: elements.boardOne }
    const two = { player: playerTwo, board: elements.boardTwo }

    elements.newScreen.classList.remove('hidden')

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

  const handleEndgame = function (data) {
    elements.endScreen.classList.remove('hidden')
    if (turn === players.one) elements.endMessage.textContent = `You Win!`
    else elements.endMessage.textContent = 'You Lose!'
  }

  const resetGame = function () {
    players = setPlayers()
    boards = initGame(players)
    turn = players.one
    elements.endScreen.classList.add('hidden')
    elements.newScreen.classList.remove('hidden')
    dom.generateBoard(elements.newBoard)
  }

  const placeEnemyShips = function () {
    let newPlace
    let axis = 'x'
    let remaining = 5
    while (remaining > 0) {
      newPlace = [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ]
      try {
        newShip(players.two, elements.boardTwo, newPlace, remaining, axis)
        remaining--
        axis = axis === 'x' ? 'y' : 'x'
      } catch {
        continue
      }
    }
  }

  const handleStart = function () {
    if (players.one.gameboard.ships.length < 5) return
    elements.newScreen.classList.add('hidden')
    placeEnemyShips()
    dom.renderShips(players.one.gameboard.board, elements.boardOne)
  }

  const handleShipPlacement = function (data) {
    if (players.one.gameboard.ships.length >= 4) {
      if (elements.newButton.disabled) elements.newButton.disabled = false
      if (players.one.gameboard.ships.length === 5) return
    }
    const target = [
      +data.composedPath()[0].classList[0][1],
      +data.composedPath()[0].classList[0][3],
    ]
    const axis =
      elements.newAxis.textContent[
        elements.newAxis.textContent.length - 1
      ].toLowerCase()
    const length = players.one.gameboard.ships.length + 1
    try {
      newShip(players.one, elements.newBoard, target, length, axis)
    } catch {}
  }

  const elements = {
    boardOne: document.getElementById('board-one'),
    boardTwo: document.getElementById('board-two'),
    playerOneWrap: document.getElementById('player-one-wrap'),
    playerTwoWrap: document.getElementById('player-two-wrap'),
    endScreen: document.getElementById('end-screen'),
    endMessage: document.querySelector('#end-screen p'),
    endButton: document.querySelector('#end-screen button'),
    newScreen: document.getElementById('new-screen'),
    newBoard: document.getElementById('new-board'),
    newAxis: document.getElementById('axis-button'),
    newButton: document.getElementById('start-button'),
  }

  let players = setPlayers()

  let turn = players.one

  let boards = initGame(players)

  obs.subscribe('attack', handleAttack)

  obs.subscribe('cellSelection', handleSelection)

  obs.subscribe('allShipsSunk', handleEndgame)

  obs.subscribe('placeShip', handleShipPlacement)

  elements.endButton.addEventListener('click', resetGame)

  elements.newButton.addEventListener('click', handleStart)

  elements.newAxis.addEventListener('click', () => {
    if (
      elements.newAxis.textContent[elements.newAxis.textContent.length - 1] ===
      'X'
    )
      elements.newAxis.textContent = 'Axis: Y'
    else elements.newAxis.textContent = 'Axis: X'
  })

  dom.generateBoard(elements.newBoard)

  return { setPlayers, boards, initGame, newShip, elements, players, updateDom }
})()

export default game

// game.newShip(game.players.one, game.elements.boardOne, [2, 4], 4, 'y')
// game.newShip(game.players.one, game.elements.boardOne, [2, 6], 3, 'x')
// game.newShip(game.players.one, game.elements.boardOne, [0, 0], 5, 'y')
// game.newShip(game.players.one, game.elements.boardOne, [8, 3], 2, 'x')
// game.newShip(game.players.one, game.elements.boardOne, [9, 7], 1, 'x')

// game.newShip(game.players.two, game.elements.boardTwo, [2, 4], 4, 'y')
// game.newShip(game.players.two, game.elements.boardTwo, [2, 6], 3, 'x')
// game.newShip(game.players.two, game.elements.boardTwo, [0, 0], 5, 'y')
// game.newShip(game.players.two, game.elements.boardTwo, [8, 3], 2, 'x')
// game.newShip(game.players.two, game.elements.boardTwo, [9, 7], 1, 'x')