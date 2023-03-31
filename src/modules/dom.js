import obs from './observer'

const dom = (function () {
    const generateBoard = function (board) {
      for (let i = 0; i < 10; i++) {
        const col = document.createElement('div')
        for (let r = 0; r < 10; r++) {
          const row = document.createElement('div')
          row.classList.add(`y${i}x${r}`)
          row.addEventListener('click', (e) => {
            obs.publish('cellSelection', e)
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
          } else if (gameboard[y][x] === 0) {
            domboard.children[y].children[x].classList.add('miss')
          }
        }
      }
    }
  
    return { startDom, renderShips }
  })()
  
  export default dom