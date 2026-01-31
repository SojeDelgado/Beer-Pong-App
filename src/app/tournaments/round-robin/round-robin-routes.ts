import { Routes } from "@angular/router";
import { RoundRobinList } from "./round-robin-list/round-robin-list";
import { RoundRobinManager } from "./round-robin-manager/round-robin-manager";
import { NewRoundRobin } from "./new-round-robin/new-round-robin";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'prefix'
    },

    {
        path: 'list',
        component:RoundRobinList
    },
    
    {
        path: 'new-round-robin',
        component: NewRoundRobin
    },
    
    {
        path: ':roundRobinId/matches',
        component: RoundRobinManager,
        // children: [
        //     {
        //         path: '',
        //         redirectTo: 'matches',
        //         pathMatch: 'prefix'
        //     },
        //     {
        //         path: 'matches',
        //         component: Matches
        //     },
        // ]
    }
]