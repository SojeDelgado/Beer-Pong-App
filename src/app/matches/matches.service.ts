import { inject, Injectable, OnInit, Signal, signal } from "@angular/core";
import { NewMatch } from "./matches-list/match/match.model";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PaginationMeta } from "../common/models/pagination-meta.interface";
import { MatchesResponse } from "./models/matches-response.interface";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root',
})
export class MatchesService {
    private http = inject(HttpClient);
    private matchesUrl = `${environment.apiurl}/matches`;

    loadMatches(
        page: number = 1, limit: number = 10, dateFilter: string = 'Recientes'
    ): Observable<MatchesResponse> {
        const params = new HttpParams()
            .set('page', page)
            .set('limit', limit)
            .set('dateFilter', dateFilter);

        return this.http.get<MatchesResponse>(this.matchesUrl, { params })
    }

    addMatch(match: NewMatch) {
        return this.http.post(this.matchesUrl, match).subscribe({
            next: () => {
                this.loadMatches();
            },
            error: (err) => {
                console.log(err);
            }
        });
    }
}