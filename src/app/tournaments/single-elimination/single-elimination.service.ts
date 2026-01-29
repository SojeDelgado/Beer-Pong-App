import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { BehaviorSubject, Observable, switchMap } from "rxjs";
import { TournamentData } from "../round-robin/tournament-data.model";
import { NewInputTournament, UpdateTournamentMatch } from "../tournament.model";
import { SingleEliminationMatch } from "../../matches/matches-list/match/match.model";
import { UpdateTournamentDto } from "../models/update-tournament-model";
import { SingleEliminationData } from "./models/single-elimination-data.model";


@Injectable({
    providedIn: 'root',
})
export class SingleEliminationService {
    private singleEliminationUrl = `${environment.apiurl}/single-elimination`;

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
        this.httpClient.get<SingleEliminationData[]>(`${this.singleEliminationUrl}`).subscribe(data => {
            this.singleEliminationsSignal.set(data);
        });
    }

    // ToDO:
    // Rehacer todos los metodos con las interfaces creadas o en common, o en la carpeta models de single-elimination.


    getMatchesById(id: string): Observable<SingleEliminationMatch[]> {
        // return this.httpClient.get<SingleEliminationMatch[]>(`${this.singleEliminationUrl}/${id}`);
        return this.refresh$.pipe(
            switchMap(() => this.httpClient.get<SingleEliminationMatch[]>(`${this.singleEliminationUrl}/${id}`))
        );
    }

    createTournamentWithMatchups(tournament: NewInputTournament) {
        return this.httpClient.post<string>(`${this.singleEliminationUrl}`, tournament)
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
        return this.httpClient.post<string>(`${this.singleEliminationUrl}/update-se-matches`, updateTournamentMatch).subscribe({
            next: () => {
                this.notifyUpdate();
            },
            error: (err) => console.error('Error actualizando match:', err)
        })
    }

    getTournamentStatus(tournamentId: string) {
        return this.refresh$.pipe(
            switchMap(() =>
                this.httpClient.get(`${this.singleEliminationUrl}/${tournamentId}/status`)
            )
        )
    }

    update(tournamentId: string, body: UpdateTournamentDto) {
        return this.refresh$.pipe(
            switchMap(() =>
                this.httpClient.patch(`${this.singleEliminationUrl}/${tournamentId}`, body)
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