import { Routes } from '@angular/router';

import { routes as playerRoutes } from './players/players.routes';
import { routes as tournamentRoutes } from './tournaments/tournaments.routes';
import { routes as matchesRoutes } from './matches/matches.routes';
import { Homepage } from './homepage/homepage';
import { Matches } from './matches/matches';
import { PlayersComponent } from './players/players.component';
import { Tournaments } from './tournaments/tournaments';

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
        component: Matches,
        children: matchesRoutes
    },
    {
        path: 'tournaments',
        component: Tournaments,
        children: tournamentRoutes
    }
];
