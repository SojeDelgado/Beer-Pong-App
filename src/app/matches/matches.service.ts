import { inject, Injectable, OnInit, Signal, signal } from "@angular/core";
import { Match, NewMatch } from "./matches-list/match/match.model";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PaginatedMatch } from "./models/paginated-match.interface";
import { PaginationMeta } from "../common/models/pagination-meta.interface";


@Injectable({
    providedIn: 'root',
})
export class MatchesService {
    private httpClient = inject(HttpClient);
    private matchesUrl = `${environment.apiurl}/matches`;

    private matchesSignal = signal<Match[]>([]);
    matches = this.matchesSignal.asReadonly();
    pagination = signal<PaginationMeta>({
        total: 1,
        page: 1,
        lastPage: 1
    })

    constructor() {
        this.loadMatches();
    }

    loadMatches(page: number = 1, limit: number = 6) {

        const params = new HttpParams()
            .set('page', page)
            .set('limit', limit);

        this.httpClient.get<PaginatedMatch>(this.matchesUrl, { params })
            .subscribe(
                response => {
                    this.matchesSignal.set(response.data);
                    this.pagination.set(response.meta);
                }
            )
    }

    addMatch(match: NewMatch) {
        return this.httpClient.post(this.matchesUrl, match).subscribe({
            next: () => {
                this.loadMatches();
            },
            error: (err) => {
                console.log(err);
            }
        });
    }
}