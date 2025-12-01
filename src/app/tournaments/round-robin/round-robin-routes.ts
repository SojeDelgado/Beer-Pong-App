import { Routes } from "@angular/router";
import { RoundRobinMatches } from "./round-robin-matches/round-robin-matches";
import { Matches } from "./round-robin-matches/matches/matches";

export const routes: Routes = [
    {
        path: ':roundRobinId',
        component: RoundRobinMatches,
        children: [
            {
                path: '',
                redirectTo: 'matches',
                pathMatch: 'prefix'
            },
            {
                path: 'matches',
                component: Matches
            }
        ]
    },
]