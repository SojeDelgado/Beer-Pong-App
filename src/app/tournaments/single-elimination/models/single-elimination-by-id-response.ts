import { Player } from "../../../players/players-list/player-item/player.model";

export interface TournamentFieldsResponse {
    id?: string;
    name?: string;
    place?: string;
    status?: string
    winner?: Player
    createdAt?: Date
    finishedAt?: Date
    totalPlayers: number
}