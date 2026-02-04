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
    private paginationSignal = signal<PaginationMeta>({
        total: 0,
        page: 1,
        lastPage: 1
    })

    matches = this.matchesSignal.asReadonly();
    pagination = this.paginationSignal.asReadonly();

    constructor() {
        this.loadMatches();
    }

    loadMatches(
        page: number = 1, limit: number = 10,
        dateFilter: string = 'Recientes'
    ) {
        const params = new HttpParams()
            .set('page', page)
            .set('limit', limit)
            .set('dateFilter', dateFilter);

        this.httpClient.get<PaginatedMatch>(this.matchesUrl, { params })
            .subscribe(
                response => {
                    this.matchesSignal.set(response.data);
                    this.paginationSignal.set(response.meta);
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