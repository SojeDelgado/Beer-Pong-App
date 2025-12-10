export interface Leaderboard {
  playerId: string,
  nickname: string,

  wins: number,
  losses: number,

  pFavor: number,
  pContra: number,

  diferencia: number
}

export interface Results {
  playerId1: string,
  playerId2: string,
  player1Nickname: string,
  player2Nickname: string,
  scoreP1: number, 
  scoreP2: number
}