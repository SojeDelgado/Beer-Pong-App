import { Routes } from "@angular/router";
import { RoundRobinComponent } from "./round-robin/round-robin";
import { routes as roundRobinRoutes } from "./round-robin/round-robin-routes";

export const routes: Routes = [
    {
        path: 'round-robin',
        component: RoundRobinComponent,
        children: roundRobinRoutes
    }
]