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
  
      if (Y < 0 || Y > 9)
        throw new Error('Cannot place ship outside board bounds!')
      if (X < 0 || X > 9)
        throw new Error('Cannot place ship outside board bounds!')
  
      if (axis === 'y') {
        if (Y > 9 - ship.body.length + 1)
          throw new Error('Ship is too big for this position!')
      } else {
        if (X > 9 - ship.body.length - 1)
          throw new Error('Ship is too big for this position!')
      }
  
      ships.push(ship)
  
      const shipLength = ship.body.length
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
      }
    }
  
    return { board, ships, placeShip, receiveAttack }
  }
  export default Gameboard