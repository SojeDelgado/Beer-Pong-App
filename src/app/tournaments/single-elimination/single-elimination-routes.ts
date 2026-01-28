import { Routes } from "@angular/router";
import { NewSingleElimination } from "./new-single-elimination/new-single-elimination";
import { SingleEliminationList } from "./single-elimination-list/single-elimination-list";
import { SingleEliminationBracketManager } from "./single-elimination-bracket-manager/single-elimination-bracket-manager";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'prefix'
    },
    {
        path: 'list',
        component: SingleEliminationList
    },
    {
        path: 'new-single-elimination',
        component: NewSingleElimination
    },
    {
        path: ':singleEliminationId/matches',
        component: SingleEliminationBracketManager
    }

]