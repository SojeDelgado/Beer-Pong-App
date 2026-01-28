import { Player } from "../../players/players-list/player-item/player.model";

export interface Stat {
    player: Player,

    puntos_favor_totales: number,
    puntos_contra_totales: number,

    partidas_jugadas: number,
    partidas_ganadas: number,
    partidas_perdidas: number,

    islas: boolean,
}

export interface UpdateStat{
    puntos_favor_totales: number,
    puntos_contra_totales: number,

    partidas_jugadas: number,
    partidas_ganadas: number,
    partidas_perdidas: number,

    islas: number,
}