import obs from '../modules/observer'
import Gameboard from '../modules/gameboard'

const Player = function (type) {
  const gameboard = Gameboard()

  const attack = function (index, enemy) {
    if (index[0] < 0 || index[0] > 9 || index[1] < 0 || index[1] > 9)
      throw new Error('Cannot attack outside the board!')

      return obs.publish('attack', [enemy, index])
  }

  let firstHit
  let nextIndex = []

  const getAdjacent = function (index) {
    const array = []
    array.push([index[0], index[1] - 1])
    array.push([index[0], index[1] + 1])
    array.push([index[0] - 1, index[1]])
    array.push([index[0] + 1, index[1]])
    return array
  }

  const play = function (enemyBoard, enemy) {
    if (type === 'user') throw new Error('Users cannot use play method!')

    if (firstHit && enemyBoard[firstHit[0]][firstHit[1]].ship.isSunk()) {
      firstHit = undefined
      nextIndex = []
    }

    let index
    while (true) {
      if (nextIndex.length > 0) {
        index = nextIndex.pop()
        if (index[0] > 9 || index[0] < 0 || index[1] > 9 || index[1] < 0)
          continue
      } else {
        index = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]
      }

      const target = enemyBoard[index[0]][index[1]]
      
      if (target === undefined) {
        break
      }
      if (typeof target === 'object' && target.section.status === 'ok') {
        if (!firstHit) firstHit = index
        const newTargets = getAdjacent(index)
        newTargets.forEach((x) => nextIndex.push(x))
        break
      }
    }
    return attack(index, enemy)
  }

  return { gameboard, type, attack, play }
}

export default Player