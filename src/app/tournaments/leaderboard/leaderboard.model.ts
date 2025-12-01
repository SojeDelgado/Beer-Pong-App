export interface Leaderboard {
  playerId: string,
  nickname: string,

  wins: number,
  losses: number

  pFavor: number,
  pContra: number,

  diferencia: number
}