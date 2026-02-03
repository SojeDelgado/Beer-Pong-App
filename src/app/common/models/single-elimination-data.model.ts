import { Player } from "../../players/players-list/player-item/player.model";

export interface TournamentData {
    id: string,
    name: string,
    place: string,

    status: string,
    winner?: Player,
    createdAt: Date,
    finishedAt: Date
}