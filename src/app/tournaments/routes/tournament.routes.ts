import { Routes } from "@angular/router";
import { RoundRobinComponent } from "../round-robin/round-robin";
import { routes as roundRobinRoutes } from "../round-robin/round-robin-routes";
import { routes as singleEliminationRoutes } from "../single-elimination/single-elimination-routes";
import { SingleElimination } from "../single-elimination/single-elimination";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'round-robin',
        pathMatch: 'prefix'
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
    },
]