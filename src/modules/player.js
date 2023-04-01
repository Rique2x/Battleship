import obs from '../modules/observer'
import Gameboard from '../modules/gameboard'

const Player = function (type) {
  const gameboard = Gameboard()

  const attack = function (index, enemy) {
    if (index[0] < 0 || index[0] > 9 || index[1] < 0 || index[1] > 9)
      throw new Error('Cannot attack outside the board!')

      return obs.publish('attack', [enemy, index])
  }

  const play = function (enemyBoard, enemy) {
    if (type === 'user') throw new Error('Users cannot use play method!')

    let index
    while (true) {
      index = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]
      const target = enemyBoard[index[0]][index[1]]
      if (target === undefined) break
      if (typeof target === 'object' && target.status === 'ok') break
    }
    return attack(index, enemy)
  }

  return { gameboard, type, attack, play }
}

export default Player