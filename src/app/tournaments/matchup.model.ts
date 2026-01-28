import { Player } from "../players/players-list/player-item/player.model";

export interface MatchUp {
    home: Player | null,
    away: Player | null,
    round: number,
    matchId: number,
    nextMatchId: number
}