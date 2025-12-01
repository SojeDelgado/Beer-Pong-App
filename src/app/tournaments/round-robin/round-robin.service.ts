import { inject, Injectable, Injector, runInInjectionContext } from "@angular/core";
import { collection, collectionData, Firestore, query, where } from '@angular/fire/firestore';
import { Observable } from "rxjs";
import { RoundRobin } from "./round-robin.model";
import { Match } from "../../matches/matches-list/match/match.model";
import { Tournament, TournamentsService } from "../tournament.service";

@Injectable({
    providedIn: 'root',
})
export class RoundRobinService {
    private firestore = inject(Firestore);
    private injector = inject(Injector);
    private tournamentService = inject(TournamentsService);

    roundRobins$ = collectionData(
        query(
            collection(this.firestore, "tournaments"),
            where('type', '==', 'ROUND_ROBIN')
        ),
        { idField: 'id' }
    ) as Observable<RoundRobin[]>;


    async saveTournamentAndMatches(tournamentData: Tournament, matchesData: Match[]): Promise<void> {
        try {
            const tournamentId = await this.tournamentService.createTournament(tournamentData);
            this.tournamentService.addTournamentMatches(tournamentId, matchesData);
        } catch (error) {
            console.error("Error en la creacion del torneo", error);
        }
    }

    getMatchesForTournament(tournamentId: string): Observable<Match[]> {
        return runInInjectionContext(this.injector, () => {
            const matchesCollection = collection(this.firestore, `tournaments/${tournamentId}/matches`)
            return collectionData(matchesCollection, { idField: 'id' }) as Observable<Match[]>;
        })
    }
}