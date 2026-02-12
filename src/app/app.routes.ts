import { Routes } from '@angular/router';

import { routes as playerRoutes } from './players/players.routes';
import { routes as matchesRoutes } from './matches/matches.routes';
import { routes as tournamentRoutes } from './tournaments/routes/tournament.routes';
import { Homepage } from './homepage/homepage';
import { PlayersComponent } from './players/players.component';
import { MatchesComponent } from './matches/matchesComponent';
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
        component: MatchesComponent,
        children: matchesRoutes
    },
    
    {
        path: 'tournaments',
        component: Tournaments,
        children: tournamentRoutes
    }
];
