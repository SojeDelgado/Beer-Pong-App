import { MatchesList } from "./matches-list/matches-list";
import { NewMatch } from "./new-match/new-match";
import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'prefix'

    },
    {
        path: 'list',
        component: MatchesList
    },
    {
        path: 'new-match',
        component: NewMatch
    }
]