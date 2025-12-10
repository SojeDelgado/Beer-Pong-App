import { Component } from "@angular/core";
import { NewMatch } from "./new-match/new-match";
import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: 'new-match',
        component: NewMatch
    }
]