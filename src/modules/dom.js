import obs from './observer'

const dom = (function () {
    const generateBoard = function (board) {
      board.replaceChildren()
      for (let i = 0; i < 10; i++) {
        const col = document.createElement('div')
        for (let r = 0; r < 10; r++) {
          const row = document.createElement('div')
          row.classList.add(`y${i}x${r}`)
          row.addEventListener('click', (e) => {
            if (e.composedPath()[2] === document.getElementById('new-board')) {
              obs.publish('placeShip', e)
            } else obs.publish('cellSelection', e)
          })
          col.append(row)
        }
        board.append(col)
      }
      return board
    }
  
    const startDom = function (elements) {
      elements.forEach((x) => generateBoard(x))
    }
  
    const renderShips = function (gameboard, domboard) {
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          if (typeof gameboard[y][x] === 'object') {
            domboard.children[y].children[x].classList.add(
              `ship${gameboard[y][x].ship.body.length}`
            )
            if (gameboard[y][x].section.status === 'hit') {
              domboard.children[y].children[x].classList.remove('ok')
              domboard.children[y].children[x].classList.add('hit')
            } else domboard.children[y].children[x].classList.add('ok')
            if (gameboard[y][x].ship.isSunk() === true) {
              domboard.children[y].children[x].classList.add('sunk')
            }
          } else if (gameboard[y][x] === 0) {
            domboard.children[y].children[x].classList.add('miss')
          }
        }
      }
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
      ghIcon: document.getElementById('gh-icon'),
    }
  
    const switchTurn = function () {
      elements.playerOneWrap.classList.toggle('turn')
      elements.playerTwoWrap.classList.toggle('turn')
    }
  
    const hideNewScreen = function () {
      elements.newScreen.classList.add('hidden')
    }
    const showNewScreen = function () {
      elements.newScreen.classList.remove('hidden')
    }
    const hideEndScreen = function () {
      elements.endScreen.classList.add('hidden')
    }
    const showEndScreen = function () {
      elements.endScreen.classList.remove('hidden')
    }
  
    const updateDom = function (players) {
      renderShips(players.one.gameboard.board, elements.boardOne)
      renderShips(players.two.gameboard.board, elements.boardTwo)
    }
  
    const getCellIndex = function (target) {
      return [+target.classList[0][1], +target.classList[0][3]]
    }
  
    const switchAxis = function () {
      if (
        elements.newAxis.textContent[elements.newAxis.textContent.length - 1] ===
        'X'
      )
        elements.newAxis.textContent = 'Axis: Y'
      else elements.newAxis.textContent = 'Axis: X'
    }
  
    generateBoard(elements.newBoard)
  
    return {
      startDom,
      renderShips,
      generateBoard,
      elements,
      switchTurn,
      hideNewScreen,
      showNewScreen,
      hideEndScreen,
      showEndScreen,
      updateDom,
      getCellIndex,
      switchAxis,
    }
  })()
  
  export default dom