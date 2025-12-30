import { Routes } from '@angular/router';

import { routes as playerRoutes } from './players/players.routes';
import { routes as tournamentRoutes } from './tournaments/tournaments.routes';
import { routes as matchesRoutes } from './matches/matches.routes';
import { Homepage } from './homepage/homepage';
import { PlayersComponent } from './players/players.component';
import { Tournaments } from './tournaments/tournaments';
import { MatchesComponent } from './matches/matchesComponent';

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
        path: 'tournaments',
        component: Tournaments,
        children: tournamentRoutes
    }
];
