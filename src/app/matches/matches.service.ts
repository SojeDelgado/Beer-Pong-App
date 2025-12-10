import { inject, Injectable } from "@angular/core";
import { Match, NewMatch } from "./matches-list/match/match.model";
import { Observable } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class MatchesService {
    private httpClient = inject(HttpClient);
    private matchesUrl = `${environment.apiurl}/matches`;

    matches = toSignal<Match[]>(this.getAllMatches());

    private getAllMatches(): Observable<Match[]> {
        return this.httpClient.get<Match[]>(this.matchesUrl)
    }

    addMatch(match: NewMatch) {
        return this.httpClient.post(this.matchesUrl, match).subscribe({
            next:(response) => {
                console.log(response);
            },
            error: (err) => {
                console.log(err);
            }
        });
    }
}