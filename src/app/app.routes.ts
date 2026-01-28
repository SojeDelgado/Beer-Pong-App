import { Routes } from '@angular/router';

import { routes as playerRoutes } from './players/players.routes';
import { routes as matchesRoutes } from './matches/matches.routes';
import { routes as roundRobinRoutes } from './tournaments/round-robin/round-robin-routes';
import { routes as singleEliminationRoutes } from './tournaments/single-elimination/single-elimination-routes';
import { Homepage } from './homepage/homepage';
import { PlayersComponent } from './players/players.component';
import { MatchesComponent } from './matches/matchesComponent';
import { RoundRobinComponent } from './tournaments/round-robin/round-robin';
import { SingleElimination } from './tournaments/single-elimination/single-elimination';


export const routes: Routes = [
    {
        path: '',
        component: Homepage
    },
    {
        path: 'players',
        component: PlayersComponent,
        children: playerRoutes
    },
    {
        path: 'matches',
        component: MatchesComponent,
        children: matchesRoutes
    },
    {
        path: 'round-robin',
        component: RoundRobinComponent,
        children: roundRobinRoutes
    },
    {
        path: 'single-elimination',
        component: SingleElimination,
        children: singleEliminationRoutes
    }
];
