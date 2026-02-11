// Global Variables
import { environment } from "../../environments/environment";
// Angular
import { inject, Injectable, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
// RXJS
import { Observable } from "rxjs";
// Matches
import { NewMatch } from "./matches-list/match/match.model";
import { MatchesResponse } from "./models/matches-response.interface";


@Injectable({
    providedIn: 'root',
})
export class MatchesService {
    private http = inject(HttpClient);
    private matchesUrl = `${environment.apiurl}/matches`;

    // Variable para recibir cambios en rxResource
    refreshTrigger = signal(0);

    loadMatchesData(
        page: number = 1, limit: number = 10, dateFilter: string = 'Recientes'
    ): Observable<MatchesResponse> {
        const params = new HttpParams()
            .set('page', page)
            .set('limit', limit)
            .set('dateFilter', dateFilter);

        return this.http.get<MatchesResponse>(this.matchesUrl, { params })
    }

    addMatch(match: NewMatch) {
        return this.http.post(this.matchesUrl, match);
    }

    // Metodo para notificar el cambio.
    notifyChange(){
        this.refreshTrigger.update( v=> v + 1);
    }
}