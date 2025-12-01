import { Timestamp } from "firebase/firestore"

export interface Match {
    playerId1: string,
    player1Nickname: string

    playerId2: string,
    player2Nickname: string,

    scoreP1: number,
    scoreP2: number,

    islaP1: boolean,
    islaP2: boolean,

    winner: string,

    date: Timestamp,
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