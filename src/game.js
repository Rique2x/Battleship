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
    dom.switchTurn()
  }


  const initGame = function (players) {
    const playerOne = players.one
    const playerTwo = players.two

    dom.startDom([elements.boardOne, elements.boardTwo])
    const one = { player: playerOne, board: elements.boardOne }
    const two = { player: playerTwo, board: elements.boardTwo }

    dom.showNewScreen()

    return { one, two }
  }

  const newShip = function (player, domboard, index, length, axis) {
    const ship = Ship(length)
    player.gameboard.placeShip(index, ship, axis)
    dom.renderShips(player.gameboard.board, domboard)
  }

  
  const handleAttack = function (data) {
    if (data[0] === players.two) {
      players.two.gameboard.receiveAttack(data[1])
    } else if (data[0] === players.one) {
      players.one.gameboard.receiveAttack(data[1])
    }
    dom.updateDom(players)
  }

  const handleSelection = function (event) {
    const target = event.target
    const targetIndex = dom.getCellIndex(target)

    if (boards.two.board === event.composedPath()[2]) {
      if (turn === players.two);
      else {
        if (target.classList[1] === 'miss' || target.classList[2] === 'hit')
        console.log('Already attacked this position!')
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
    dom.showEndScreen()
    if (turn === players.one) elements.endMessage.textContent = `You Win!`
    else elements.endMessage.textContent = 'You Lose!'
  }

  const resetGame = function () {
    players = setPlayers()
    boards = initGame(players)
    turn = players.one
    dom.hideEndScreen()
    dom.showNewScreen()
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
    dom.hideNewScreen()
    placeEnemyShips()
    dom.renderShips(players.one.gameboard.board, elements.boardOne)
  }

  const handleShipPlacement = function (data) {
    if (players.one.gameboard.ships.length >= 4) {
      if (elements.newButton.disabled) elements.newButton.disabled = false
      if (players.one.gameboard.ships.length === 5) return
    }
    const target = dom.getCellIndex(data.composedPath()[0])
    const axis =
      elements.newAxis.textContent[
        elements.newAxis.textContent.length - 1
      ].toLowerCase()
    const length = players.one.gameboard.ships.length + 1
    try {
      newShip(players.one, elements.newBoard, target, length, axis)
    } catch {}
  }

  const elements = dom.elements

  let players = setPlayers()

  let turn = players.one

  let boards = initGame(players)

  obs.subscribe('attack', handleAttack)

  obs.subscribe('cellSelection', handleSelection)

  obs.subscribe('allShipsSunk', handleEndgame)

  obs.subscribe('placeShip', handleShipPlacement)

  elements.endButton.addEventListener('click', resetGame)

  elements.newButton.addEventListener('click', handleStart)

  elements.newAxis.addEventListener('click', dom.switchAxis)

  elements.ghIcon.src = gh

  return {}
})()

export default game
