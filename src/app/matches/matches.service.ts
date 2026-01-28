import { inject, Injectable, OnInit, signal } from "@angular/core";
import { Match, NewMatch } from "./matches-list/match/match.model";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root',
})
export class MatchesService {
    private httpClient = inject(HttpClient);
    private matchesUrl = `${environment.apiurl}/matches`;

    private matchesSignal = signal<Match[]>([]);
    matches = this.matchesSignal.asReadonly();

    constructor() {
        this.loadMatches();
    }

    loadMatches() {
        this.httpClient.get<Match[]>(this.matchesUrl)
        .subscribe(
            matches => {
                this.matchesSignal.set(matches);
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