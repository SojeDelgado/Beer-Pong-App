// Angular
import { inject, Injectable } from "@angular/core";
// Model
import { Stat, UpdateStat } from "./stat/stat.model";
import { Match } from "../matches/matches-list/match/match.model";
// RXJS
import { Observable } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
// HTTP
import { HttpClient } from "@angular/common/http";
// Variables
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class StatsService {
    private httpClient = inject(HttpClient)
    private statsUrl = `${environment.apiurl}/stats`;

    allStats = toSignal(this.getAllStats());

    private getAllStats(): Observable<Stat[]> {
        return this.httpClient.get<Stat[]>(this.statsUrl);
    }
}