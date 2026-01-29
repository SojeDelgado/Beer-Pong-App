import { Player } from "../../../players/players-list/player-item/player.model";

export interface SingleEliminationData {
    id: string,
    name: string,
    place: string,

    status: string,
    winnerId?: Player,
    createdAt: Date,
    finishedAt: Date
}