import { NewMatch } from "../matches/matches-list/match/match.model" 

export interface Tournament {
    name: string,
    type: string,
    place: string,
    matches: NewMatch[],
    round: number
}

export interface NewTournament {
    name: string,
    type: string,
    place: string,
    matches: NewMatch[],
}