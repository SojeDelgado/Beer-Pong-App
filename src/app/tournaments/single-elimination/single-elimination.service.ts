// Global Variables
import { environment } from "../../../environments/environment";
// Angular
import { inject, Injectable, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
// RxJS
import { catchError, Observable, throwError } from "rxjs";
// Interfaces
import { SingleEliminationMatch } from "./models/single-elimination-match.model";
import { SingleEliminationResponse } from "./models/single-elimination-response.interface";
// Common
import { UpdateTournament } from "../../common/models/update-tournament.model";
import { NewTournament } from "../../common/models/new-tournament.model";
import { UpdateTournamentMatch } from "../../common/models/update-tournament-match.model";
import { ErrorService } from "../../shared/error.service";
import { TournamentFieldsResponse } from "./models/single-elimination-by-id-response";


@Injectable({
    providedIn: 'root',
})
export class SingleEliminationService {
    private httpClient = inject(HttpClient);
    private singleEliminationUrl = `${environment.apiurl}/single-elimination`;
    private errorService = inject(ErrorService);

    // Variable para recibir cambios en rxResource
    refreshTrigger = signal(0);

    loadTournamentsData(
        page: number = 1, limit: number = 10,
        dateFilter: string = 'Recientes'
    ): Observable<SingleEliminationResponse> {
        const params = new HttpParams()
            .set('page', page)
            .set('limit', limit)
            .set('dateFilter', dateFilter);

        return this.httpClient
        .get<SingleEliminationResponse>(this.singleEliminationUrl, { params });
    }

    getSingleEliminationById(id: string, fields?: string): Observable<TournamentFieldsResponse> {
        let params = new HttpParams();
        if (fields) {
            params = params.set('fields', fields);
        }

        return this.httpClient
        .get<TournamentFieldsResponse>( `${this.singleEliminationUrl}/${id}`, { params } );
    }

    getMatchesById(id: string): Observable<SingleEliminationMatch[]> {
        return this.httpClient.get<SingleEliminationMatch[]>(`${this.singleEliminationUrl}/${id}/matches`);
    }

    createSingleElimination(tournament: NewTournament) {
        return this.httpClient.post(`${this.singleEliminationUrl}`, tournament)
        .pipe(
            catchError(() => {
                this.errorService.showError('Fallo al crear un torneo.');
                return throwError(() => new Error('Fallo al crear un torneo.'))
            })
        )
    }

    updateTournamentMatch(id: string, matchId: number, updateTournamentMatch: UpdateTournamentMatch) {
        return this.httpClient.patch(`${this.singleEliminationUrl}/${id}/matches/${matchId}`, updateTournamentMatch)
        .pipe(
            catchError((err) => {
                this.errorService.showError(`Fallo al actualizar el partido`);
                return throwError(() => new Error('Fallo al actualizar un torneo.'));
            })
        )
    }

    finishTournament(id: string) {
        // Post null para que no se queje ts. (En el backend no pide un body).
        return this.httpClient.post(`${this.singleEliminationUrl}/${id}/finish-tournament`, null)
        .pipe(
            catchError((err) => {
                this.errorService.showError(`Fallo al intentar terminar un torneo.`);
                return throwError(() => new Error('Fallo al intentar terminar un torneo.'));
            })
        )
    }

    // No component is implementing this. At the moment.
    update(id: string, body: UpdateTournament) {
        return this.httpClient.patch(`${this.singleEliminationUrl}/${id}`, body);
    }

    // Metodo para notificar el cambio.
    notifyChange(){
        this.refreshTrigger.update( v=> v + 1);
    }
}