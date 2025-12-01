import { inject, Injectable } from "@angular/core";
import { addDoc, collection, doc, Firestore, writeBatch } from "@angular/fire/firestore";

export interface Tournament {
    name: string,
    type: string,
    place: string,
    date: Date
}

@Injectable({
    providedIn: 'root',
})
export class TournamentsService {
    private firestore = inject(Firestore);

    async createTournament(tournamentData: Tournament): Promise<string> {
        const tournamentRef = collection(this.firestore, 'tournaments');
        const newDocRef = await addDoc(tournamentRef, {
            ...tournamentData
        });

        return newDocRef.id;
    }

    async addTournamentMatches(tournamentId: string, matches: any[]): Promise<void> {
        const batch = writeBatch(this.firestore);
        const matchesRef = collection(this.firestore, `tournaments/${tournamentId}/matches`);

        matches.forEach(match => {
            const matchData = {
                tournamentId: tournamentId,
                playerId1: match.playerId1,
                player1Nickname: match.player1Nickname,
                playerId2: match.playerId2,
                player2Nickname: match.player2Nickname,
                scoreP1: match.scoreP1,
                scoreP2: match.scoreP2,
                winner: match.scoreP1 > match.scoreP2 ? match.playerId1 :
                    match.scoreP2 > match.scoreP1 ? match.playerId2 : 'DRAW',
            };
            batch.set(doc(matchesRef), matchData);
        });

        await batch.commit();
    }

}