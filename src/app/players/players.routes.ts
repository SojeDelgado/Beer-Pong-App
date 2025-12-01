import { Routes } from "@angular/router";
import { Stats } from "../stats/stats";
import { PlayerStats } from "./player-stats/player-stats";
import { NoStats } from "../stats/no-stats/no-stats";
import { NewPlayer } from "./new-player/new-player";

export const routes: Routes = [
    {
        path: 'new-player',
        component: NewPlayer
    },
    {
        path: '',
        component: NoStats
    },
    {
        path: ':playerId',
        component: PlayerStats,
        children: [
            {
                path: '',
                redirectTo: 'stats',
                pathMatch: 'prefix'
            },
            {
                path: 'stats',
                component: Stats
            }
        ]
    }
]