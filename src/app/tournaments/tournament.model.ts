import { NewMatch } from "../matches/matches-list/match/match.model"
import { MatchUp } from "./matchup.model";

export interface Tournament {
    name: string,
    type: string,
    place: string,
    matches: NewMatch[],
}

export interface NewTournament {
    name: string,
    type: string,
    place: string,
    matches: NewMatch[],
}

// Esta interface servira para crear el torneo y los matches vacios de single elimination
// Para asi posteriormente editarlos.
export interface NewInputTournament {
    name: string,
    type: string,
    place: string,
    playersIds: string[],
}

export interface UpdateTournamentMatch {
    tournamentId: string,
    home?: string,
    away?: string,
    homeScore: number,
    awayScore: number,
    homeIsla: boolean,
    awayIsla: boolean,
    home2in1: boolean,
    away2in1: boolean,
    home3in1: boolean,
    away3in1: boolean,
    matchId: number,
    nextMatchId: number | null,
}