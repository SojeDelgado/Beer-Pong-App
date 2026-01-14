import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { TournamentData } from "../round-robin/tournament-data.model";
import { MatchUp } from "../matchup.model";
import { toSignal } from "@angular/core/rxjs-interop";
import { NewTournamentSingleElimination, UpdateTournamentMatch } from "../tournament.model";
import { SingleEliminationMatch } from "../../matches/matches-list/match/match.model";
// Sockets
import { io } from 'socket.io-client';


@Injectable({
    providedIn: 'root',
})
export class SingleEliminationService {
    private socket = io(environment.apiurl);
    private tournamentUrl = `${environment.apiurl}/tournaments`;

    private httpClient = inject(HttpClient);

    private singleEliminationsSignal = signal<TournamentData[]>([]);
    singleEliminations = this.singleEliminationsSignal.asReadonly();


    type = "SingleElimination";


    constructor() {
        this.loadInitialSingleEliminations();
        this.setupSocketListeners();
    }

    private loadInitialSingleEliminations() {
        const type = this.type;
        let params = { type };
        this.httpClient.get<TournamentData[]>(`${this.tournamentUrl}`, { params }).subscribe(data => {
            this.singleEliminationsSignal.set(data);
        });
    }

    private setupSocketListeners() {
        this.socket.on('tournamentAdded', (newMatch: any) => {
            const normalizedMatch = {
                ...newMatch,
                id: newMatch.id || newMatch._id
            };
            this.singleEliminationsSignal.update(current => [...current, normalizedMatch]);
        });
    }

    getMatchesById(id: string): Observable<SingleEliminationMatch[]> {
        return this.httpClient.get<SingleEliminationMatch[]>(`${this.tournamentUrl}/${id}`);
    }

    generateMatchups(playersIds: string[]): Observable<MatchUp[]> {
        return this.httpClient.post<MatchUp[]>(
            `${this.tournamentUrl}/generate-matchups`,
            { playersIds: playersIds, type: this.type }
        )
    }

    createTournamentWithMatchups(tournament: NewTournamentSingleElimination): Observable<string> {
        return this.httpClient.post<string>(`${this.tournamentUrl}/create-tournament-with-matchups`, tournament);
    }

    updateTournamentMatch(updateTournamentMatch: UpdateTournamentMatch): Observable<string> {
        return this.httpClient.post<string>(`${this.tournamentUrl}/update-matches`, updateTournamentMatch);
    }
}