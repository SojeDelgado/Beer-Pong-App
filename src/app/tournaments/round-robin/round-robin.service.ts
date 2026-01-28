import { inject, Injectable, signal } from "@angular/core";
import { BehaviorSubject, Observable, switchMap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { MatchUp } from "../matchup.model";
import { NewInputTournament, UpdateTournamentMatch } from "../tournament.model";
import { TournamentData } from "./tournament-data.model";
import { RoundRobinMatchesInterface } from "./models/round-robin-matches-model";

@Injectable({
    providedIn: 'root',
})
export class RoundRobinService {
    private httpClient = inject(HttpClient);
    private tournamentUrl = `${environment.apiurl}/tournaments`;

    private roundRobinSignal = signal<TournamentData[]>([]);
    roundRobins = this.roundRobinSignal.asReadonly();
    type = "RoundRobin";

    // Variable para saber si algun match se actualizo y notificar.
    private refresh$ = new BehaviorSubject<void>(undefined);

    notifyUpdate() {
        this.refresh$.next();
    }

    constructor() {
        this.loadTournaments();
    }

    private loadTournaments() {
        const type = this.type;
        let params = { type };
        this.httpClient.get<TournamentData[]>(`${this.tournamentUrl}`, { params }).subscribe(data => {
            this.roundRobinSignal.set(data);
        });
    }

    getMatchesById(id: string): Observable<RoundRobinMatchesInterface[]> {
        // return this.httpClient.get<RoundRobinMatchesInterface[]>(`${this.tournamentUrl}/${id}`)
        return this.refresh$.pipe(
            switchMap(() => this.httpClient.get<RoundRobinMatchesInterface[]>(`${this.tournamentUrl}/${id}`)
            )
        )
    }

    generateMatchups(playersIds: string[]): Observable<MatchUp[]> {
        return this.httpClient.post<MatchUp[]>(
            `${this.tournamentUrl}/generate-matchups`,
            { playersIds: playersIds, type: this.type }
        )
    }

    createTournament(tournament: NewInputTournament) {
        return this.httpClient.post(this.tournamentUrl, tournament).subscribe({
            next: (response) => {
                this.loadTournaments();
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    updateTournamentMatch(updateTournamentMatch: UpdateTournamentMatch) {
        return this.httpClient.post(`${this.tournamentUrl}/update-match`, updateTournamentMatch).subscribe({
            next: () => {
                this.notifyUpdate();
            }
        })
    }

    getTournamentStatus(tournamentId: string) {
        return this.refresh$.pipe(
            switchMap(() =>
                this.httpClient.get(`${this.tournamentUrl}/${tournamentId}/status`)
            )
        )
    }
}