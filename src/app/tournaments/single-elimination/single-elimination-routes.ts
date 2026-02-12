import { Routes } from "@angular/router";
import { NewSingleElimination } from "./new-single-elimination/new-single-elimination";
import { SingleEliminationList } from "./single-elimination-list/single-elimination-list";
import { SingleEliminationBracketManager } from "./single-elimination-bracket-manager/single-elimination-bracket-manager";

export const routes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'prefix'
    },
    {
        path: '',
        component: SingleEliminationList
    },
    {
        path: 'new',
        component: NewSingleElimination
    },
    {
        path: ':singleEliminationId/matches',
        component: SingleEliminationBracketManager
    }

]