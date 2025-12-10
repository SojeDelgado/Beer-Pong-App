import { Player } from "../../../players/players-list/player-item/player.model"

export interface Match {
    player1: Player,
    player2: Player,

    scoreP1: number,
    scoreP2: number,

    islaP1: boolean,
    islaP2: boolean,

    winner: string,
    date: Date
}

export interface NewMatch {
    player1: string,
    player2: string,

    scoreP1: number,
    scoreP2: number,

    islaP1: boolean,
    islaP2: boolean,

    winner: string
}

export interface TournamentMatch {
    tournamentId: string,
    playerId1: string,
    player1Nickname: string

    playerId2: string,
    player2Nickname: string,

    scoreP1: number,
    scoreP2: number,

    winner: string,

}