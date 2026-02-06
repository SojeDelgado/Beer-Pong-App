import { Player } from "../../players/players-list/player-item/player.model";

export interface Stat {
    player: Player,

    puntos_favor_totales: number,
    puntos_contra_totales: number,

    partidas_jugadas: number,
    partidas_ganadas: number,
    partidas_perdidas: number,

    torneos_jugados: number,
    torneos_ganados: number,
    torneos_perdidos: number,

    islas: number,
    s2in1: number,
    s3in1: number
}

export interface UpdateStat{
    puntos_favor_totales: number,
    puntos_contra_totales: number,

    partidas_jugadas: number,
    partidas_ganadas: number,
    partidas_perdidas: number,

    islas: number,
}