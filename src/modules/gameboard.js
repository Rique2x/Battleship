import obs from '../modules/observer'

const Gameboard = function () {
    const makeBoard = function () {
      const board = []
      for (let i = 0; i < 10; i++) {
        board.push(Array(10))
      }
      return board
    }
  
    const board = makeBoard()
    const ships = []
  
    const placeShip = function (index, ship, axis = 'x') {
      if (axis !== 'x') axis = 'y'
      let Y = index[0]
      let X = index[1]
      const shipLength = ship.body.length
  
      if (Y < 0 || Y > 9)
        throw new Error('Cannot place ship outside board bounds!')
      if (X < 0 || X > 9)
        throw new Error('Cannot place ship outside board bounds!')
  
      if (axis === 'y') {
        if (Y > 9 - ship.body.length + 1)
          throw new Error('Ship is too big for this position!')

          let y = Y
      for (let i = 0; i < shipLength; i++) {
        if (typeof board[y][X] === 'object') {
          throw new Error('Space already has a ship!')
        }
        y++
      }
      } else {
        if (X > 9 - ship.body.length - 1)
          throw new Error('Ship is too big for this position!')

          let x = X
      for (let i = 0; i < shipLength; i++) {
        if (typeof board[Y][x] === 'object') {
          throw new Error('Space already has a ship!')
        }
        x++
      }
      }
      
  
      ships.push(ship)
  
      
      for (let i = 0; i < shipLength; i++) {
        board[Y][X] = { ship, section: ship.body[i] }
        axis === 'x' ? X++ : Y++
      }
    }
  
    const receiveAttack = function (index) {
      const target = board[index[0]][index[1]]
  
      if (target === undefined) {
        board[index[0]][index[1]] = 0
      } else {
        target.section.status = 'hit'
        if (target.ship.isSunk()) {
          if (ships.every((x) => x.isSunk()))
            return obs.publish('all ships sunk', this)
          return obs.publish('ship sunk', target.ship)
        }
      }
    }
  
    return { board, ships, placeShip, receiveAttack }
  }
  export default Gameboard