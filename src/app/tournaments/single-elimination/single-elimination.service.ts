import { inject, Injectable, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { BehaviorSubject, Observable, switchMap } from "rxjs";
import { UpdateTournament } from "../../common/models/update-tournament.model";
import { TournamentData } from "../../common/models/single-elimination-data.model";
import { SingleEliminationMatch } from "./models/single-elimination-match.model";
import { NewTournament } from "../../common/models/new-tournament.model";
import { UpdateTournamentMatch } from "../../common/models/update-tournament-match.model";


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
        this.httpClient.get<TournamentData[]>(`${this.singleEliminationUrl}`).subscribe(data => {
            this.singleEliminationsSignal.set(data);
        });
    }

    // ToDO:
    // Rehacer todos los metodos con las interfaces creadas o en common, o en la carpeta models de single-elimination.

    getSingleEliminationById(id: string, fields?: string) {
        return this.refresh$.pipe(
            switchMap(() => {
                // Configuramos los parámetros de búsqueda
                let params = new HttpParams();
                if (fields) {
                    params = params.set('fields', fields);
                }

                return this.httpClient.get<SingleEliminationMatch[]>(
                    `${this.singleEliminationUrl}/${id}`,
                    { params }
                );
            })
        )
    }

    getMatchesById(id: string): Observable<SingleEliminationMatch[]> {
        return this.refresh$.pipe(
            switchMap(() => this.httpClient.get<SingleEliminationMatch[]>(`${this.singleEliminationUrl}/${id}/matches`))
        );
    }


    createSingleElimination(tournament: NewTournament) {
        return this.httpClient.post(`${this.singleEliminationUrl}`, tournament)
            .subscribe({
                next: () => {
                    this.loadTournaments();
                },
                error: (err) => {
                    console.log(err);
                    console.log("your request:", tournament);
                }
            })
    }

    updateTournamentMatch(id: string, matchId: number, updateTournamentMatch: UpdateTournamentMatch) {
        return this.httpClient.patch(`${this.singleEliminationUrl}/${id}/matches/${matchId}`, updateTournamentMatch)
            .subscribe({
                next: () => {
                    this.notifyUpdate();
                    this.loadTournaments();
                },
                error: (err) => console.error('Error actualizando match:', err)
            });
    }

    update(id: string, body: UpdateTournament) {
        return this.httpClient.patch(`${this.singleEliminationUrl}/${id}`, body)
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
}