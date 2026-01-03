import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { MatchUp } from "../matchup.model";
import { Tournament } from "../tournament.model";
import { toSignal } from "@angular/core/rxjs-interop";
import { TournamentData } from "./tournament-data.model";
import { Match } from "../../matches/matches-list/match/match.model";

@Injectable({
    providedIn: 'root',
})
export class RoundRobinService {
    private httpClient = inject(HttpClient);
    private tournamentUrl = `${environment.apiurl}/tournaments`;
    type = "RoundRobin";
    roundRobins = toSignal<TournamentData[]>(this.getAll())

    private getAll(): Observable<TournamentData[]> {
        const type = this.type;
        let params = { type };
        return this.httpClient.get<TournamentData[]>(`${this.tournamentUrl}`, { params })
    }

    getMatchesById(id: string): Observable<Match[]>{
        return this.httpClient.get<Match[]>(`${this.tournamentUrl}/${id}`);
    }

    generateMatchups(playersIds: string[]): Observable<MatchUp[]> {
        return this.httpClient.post<MatchUp[]>(
            `${this.tournamentUrl}/generate-matchups`,
            { playersIds: playersIds, type: this.type }
        )
    }

    createTournament(tournament: Tournament) {
        return this.httpClient.post(this.tournamentUrl, tournament).subscribe({
            next: (response) => {
                console.log(response);
            },
            error: (err) => {
                console.error(err);
            }
        });
    }
}