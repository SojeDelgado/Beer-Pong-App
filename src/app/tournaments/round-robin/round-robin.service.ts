// Global Variables
import { environment } from "../../../environments/environment";
// Angular
import { inject, Injectable, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
// RxJS
import { catchError, Observable, throwError } from "rxjs";
// Services
import { ErrorService } from "../../shared/error.service";
// Interfaces
import { RoundRobinMatch } from "./models/round-robin-matches-model";
import { SingleEliminationMatch } from "../single-elimination/models/single-elimination-match.model";
import { UpdateTournamentMatch } from "../../common/models/update-tournament-match.model";
import { NewTournament } from "../../common/models/new-tournament.model";
import { UpdateTournament } from "../../common/models/update-tournament.model";
import { TournamentResponse } from "../../common/models/tournament-response.interface";
import { TournamentFieldsResponse } from "../single-elimination/models/single-elimination-by-id-response";

@Injectable({
    providedIn: 'root',
})
export class RoundRobinService {
    private httpClient = inject(HttpClient);
    private tournamentUrl = `${environment.apiurl}/round-robin`;
    private errorService = inject(ErrorService);

    // Variable para recibir cambios en rxResource
    refreshTrigger = signal(0);


    loadTournamentsData(
        page: number = 1, limit: number = 10,
        dateFilter: string = 'Recientes'
    ): Observable<TournamentResponse> {
        const params = new HttpParams()
            .set('page', page)
            .set('limit', limit)
            .set('dateFilter', dateFilter);

        return this.httpClient
            .get<TournamentResponse>(`${this.tournamentUrl}`, { params });
    }

    getTournamentById(id: string, fields?: string) {
        // Configuramos los parámetros de búsqueda
        let params = new HttpParams();
        if (fields) {
            params = params.set('fields', fields);
        }

        return this.httpClient
            .get<TournamentFieldsResponse>(`${this.tournamentUrl}/${id}`, { params });
    }

    getRoundRobinMatches(id: string): Observable<RoundRobinMatch[]> {
        return this.httpClient.get<RoundRobinMatch[]>(`${this.tournamentUrl}/${id}/rrMatches`);
    }

    getSingleEliminationMatches(id: string): Observable<SingleEliminationMatch[]> {
        return this.httpClient.get<SingleEliminationMatch[]>(`${this.tournamentUrl}/${id}/seMatches`);
    }

    create(tournament: NewTournament) {
        return this.httpClient.post(this.tournamentUrl, tournament)
            .pipe(
                catchError(() => {
                    this.errorService.showError('Fallo al crear un torneo.');
                    return throwError(() => new Error('Fallo al crear un torneo.'))
                })
            )
    }

    updateRoundRobinMatch(id: string, matchId: number, updateTournamentMatch: UpdateTournamentMatch) {
        return this.httpClient.patch(`${this.tournamentUrl}/${id}/rrMatches/${matchId}`, updateTournamentMatch);
    }

    updateSingleEliminationMatch(id: string, matchId: number, updateTournamentMatch: UpdateTournamentMatch) {
        return this.httpClient.patch(`${this.tournamentUrl}/${id}/seMatches/${matchId}`, updateTournamentMatch);
    }

    update(id: string, body: UpdateTournament) {
        return this.httpClient.patch(`${this.tournamentUrl}/${id}`, body);
    }

    promotePlayers(id: string, playersCount: number) {
        return this.httpClient.post(`${this.tournamentUrl}/${id}/actions/promote-to-elimination`,
            { players_count: playersCount }
        );
    }

    finishTournament(id: string) {
        // body null para que no se queje ts. (En el backend no pide un body).
        return this.httpClient.post(`${this.tournamentUrl}/${id}/finish-tournament`, null);
    }

    // Metodo para notificar el cambio.
    notifyChange() {
        this.refreshTrigger.update(v => v + 1);
    }
}