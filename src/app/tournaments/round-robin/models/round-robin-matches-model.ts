import { Player } from "../../../players/players-list/player-item/player.model";

export interface RoundRobinMatchesInterface {
    home?: Player,
    away?: Player,
    homeScore: number,
    awayScore: number,

    homeIsla: boolean,
    awayIsla: boolean,

    home2in1: boolean,
    away2in1: boolean,

    home3in1: boolean,
    away3in1: boolean,

    round: number
}