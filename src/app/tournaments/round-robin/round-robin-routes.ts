import { Routes } from "@angular/router";
import { RoundRobinMatches } from "./round-robin-matches/round-robin-matches";
import { Matches } from "./round-robin-matches/matches/matches";
import { NewRoundRobin } from "./new-round-robin/new-round-robin";

export const routes: Routes = [
    {
        path: 'new-round-robin',
        component: NewRoundRobin
    },
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
            },
        ]
    },
]