import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { BehaviorSubject, Observable, switchMap } from "rxjs";
import { TournamentData } from "../round-robin/tournament-data.model";
import { MatchUp } from "../matchup.model";
import { NewInputTournament, UpdateTournamentMatch } from "../tournament.model";
import { SingleEliminationMatch } from "../../matches/matches-list/match/match.model";
import { UpdateTournamentDto } from "../models/update-tournament-model";


@Injectable({
    providedIn: 'root',
})
export class SingleEliminationService {
    private tournamentUrl = `${environment.apiurl}/tournaments`;

    private httpClient = inject(HttpClient);

    private singleEliminationsSignal = signal<TournamentData[]>([]);
    singleEliminations = this.singleEliminationsSignal.asReadonly();
    type = "SingleElimination";

    // Variable para saber si algun match se actualizo y notificar.
    private refresh$ = new BehaviorSubject<void>(undefined);

    // metodo para notificar que hubo un cambio.
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
            this.singleEliminationsSignal.set(data);
        });
    }

    getMatchesById(id: string): Observable<SingleEliminationMatch[]> {
        // return this.httpClient.get<SingleEliminationMatch[]>(`${this.tournamentUrl}/${id}`);
        return this.refresh$.pipe(
            switchMap(() => this.httpClient.get<SingleEliminationMatch[]>(`${this.tournamentUrl}/${id}`))
        );
    }

    generateMatchups(playersIds: string[]): Observable<MatchUp[]> {
        return this.httpClient.post<MatchUp[]>(
            `${this.tournamentUrl}/generate-matchups`,
            { playersIds: playersIds, type: this.type }
        )
    }

    createTournamentWithMatchups(tournament: NewInputTournament) {
        return this.httpClient.post<string>(`${this.tournamentUrl}`, tournament)
            .subscribe({
                next: () => {
                    this.loadTournaments();
                },
                error: (err) => {
                    console.log(err);
                }
            })
    }

    updateTournamentMatch(updateTournamentMatch: UpdateTournamentMatch) {
        return this.httpClient.post<string>(`${this.tournamentUrl}/update-se-matches`, updateTournamentMatch).subscribe({
            next: () => {
                this.notifyUpdate();
            },
            error: (err) => console.error('Error actualizando match:', err)
        })
    }

    getTournamentStatus(tournamentId: string) {
        return this.refresh$.pipe(
            switchMap(() =>
                this.httpClient.get(`${this.tournamentUrl}/${tournamentId}/status`)
            )
        )
    }

    update(tournamentId: string, body: UpdateTournamentDto) {
        return this.refresh$.pipe(
            switchMap(() =>
                this.httpClient.patch(`${this.tournamentUrl}/${tournamentId}`, body)
            )
        ).subscribe({
            next: () => {
                this.notifyUpdate();
            },
            error: (err) => {
                console.log(err);
            }
        })
    }
}