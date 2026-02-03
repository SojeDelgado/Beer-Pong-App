import { Player } from "../../../players/players-list/player-item/player.model";

export interface SingleEliminationMatch {
    home: Player,
    away: Player,

    matchId: number,
    nextMatchId?: number,
    round: number

    homeScore: number,
    awayScore: number,

    homeIsla: boolean,
    awayIsla: boolean,

    home2in1: boolean,
    away2in1: boolean,

    home3in1: boolean,
    away3in1: boolean,

}