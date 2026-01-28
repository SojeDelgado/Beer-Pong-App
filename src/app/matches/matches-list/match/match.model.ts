import { Player } from "../../../players/players-list/player-item/player.model"

export interface Match {
    home: Player,
    away: Player,

    homeScore: number,
    awayScore: number,

    homeIsla: boolean,
    awayIsla: boolean,

    home2in1: boolean,
    away2in1: boolean,

    home3in1: boolean,
    away3in1: boolean,

    date: Date
}

export interface NewMatch {
    home: string,
    away: string,

    homeScore: number,
    awayScore: number,

    homeIsla: boolean,
    awayIsla: boolean,

    home2in1: boolean,
    away2in1: boolean,

    home3in1: boolean,
    away3in1: boolean,

}

export interface SingleEliminationMatch {
    id: string,

    home: Player,
    away: Player,

    homeScore: number,
    awayScore: number,

    homeIsla: boolean,
    awayIsla: boolean,

    home2in1: boolean,
    away2in1: boolean,

    home3in1: boolean,
    away3in1: boolean,

    date: Date

    matchId: number,
    nextMatchId: number | null,
    round: number
}