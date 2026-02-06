import { inject, Injectable, signal } from "@angular/core";
import { BehaviorSubject, Observable, switchMap } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { NewInputTournament } from "../tournament.model";
import { RoundRobinMatch } from "./models/round-robin-matches-model";
import { SingleEliminationMatch } from "../single-elimination/models/single-elimination-match.model";
import { TournamentData } from "../../common/models/single-elimination-data.model";
import { UpdateTournamentMatch } from "../../common/models/update-tournament-match.model";
import { NewTournament } from "../../common/models/new-tournament.model";
import { UpdateTournament } from "../../common/models/update-tournament.model";

@Injectable({
    providedIn: 'root',
})
export class RoundRobinService {
    private httpClient = inject(HttpClient);
    private tournamentUrl = `${environment.apiurl}/round-robin`;

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
        this.httpClient.get<TournamentData[]>(`${this.tournamentUrl}`).subscribe(data => {
            this.roundRobinSignal.set(data);
        });
    }

    getRoundRobinById(id: string, fields?: string) {
        return this.refresh$.pipe(
            switchMap(() => {
                // Configuramos los parámetros de búsqueda
                let params = new HttpParams();
                if (fields) {
                    params = params.set('fields', fields);
                }

                return this.httpClient.get<any>(
                    `${this.tournamentUrl}/${id}`,
                    { params }
                );
            })
        )
    }

    getRoundRobinMatches(id: string): Observable<RoundRobinMatch[]> {
        // return this.httpClient.get<RoundRobinMatchesInterface[]>(`${this.tournamentUrl}/${id}`)
        return this.refresh$.pipe(
            switchMap(() => this.httpClient.get<RoundRobinMatch[]>(`${this.tournamentUrl}/${id}/rrMatches`)
            )
        )
    }

    getSingleEliminationMatches(id: string): Observable<SingleEliminationMatch[]> {
        return this.refresh$.pipe(
            switchMap(() => this.httpClient.get<SingleEliminationMatch[]>(`${this.tournamentUrl}/${id}/seMatches`)
            )
        )
    }



    create(tournament: NewTournament) {
        return this.httpClient.post(this.tournamentUrl, tournament).subscribe({
            next: () => {
                this.loadTournaments();
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    updateRoundRobinMatch(id: string, matchId: number, updateTournamentMatch: UpdateTournamentMatch) {
        return this.httpClient.patch(`${this.tournamentUrl}/${id}/rrMatches/${matchId}`, updateTournamentMatch)
            .subscribe({
                next: () => {
                    this.notifyUpdate();
                }
            })
    }

    updateSingleEliminationMatch(id: string, matchId: number, updateTournamentMatch: UpdateTournamentMatch) {
        return this.httpClient.patch(`${this.tournamentUrl}/${id}/seMatches/${matchId}`, updateTournamentMatch)
            .subscribe({
                next: () => {
                    this.notifyUpdate();
                },
                error: (err) => console.error('Error actualizando match:', err)
            });
    }

    update(id: string, body: UpdateTournament) {
        return this.httpClient.patch(`${this.tournamentUrl}/${id}`, body)
            .subscribe({
                next: () => {
                    this.notifyUpdate();
                    this.loadTournaments();
                },
                error: (err) => {
                    console.log(err);
                }
            })
    }

    promotePlayers(id: string, playersCount: number) {
        return this.httpClient.post(`${this.tournamentUrl}/${id}/actions/promote-to-elimination`,
            { players_count: playersCount }
        )
        .subscribe({
            next: () => {
                this.notifyUpdate();
            },
            error: (err) => console.error('Error promoviendo a los jugadores:', err)
        });
    }
}