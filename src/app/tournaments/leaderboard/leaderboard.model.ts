import { Player } from "../../players/players-list/player-item/player.model"

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
  home: Player | null,
  away: Player | null,
  homeScore: number, 
  awayScore: number
}