import Player from './modules/player'

const setPlayers = function () {
  const playerOne = Player('user')
  const playerTwo = Player('computer')
  return [playerOne, playerTwo]
}

export { setPlayers }