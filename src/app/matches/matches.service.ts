import { inject, Injectable } from "@angular/core";
import { Match } from "./matches-list/match/match.model";

// 
import { addDoc, collection, collectionData, Firestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";

@Injectable({
    providedIn: 'root',
})
export class MatchesService {
    private firestore = inject(Firestore);
    matches = toSignal<Match[]>(this.getAllMatches());

    getAllMatches(): Observable<Match[]> {
        const matchesRef = collection(this.firestore, 'matches');
        return collectionData(matchesRef, { idField: 'id' }) as Observable<Match[]>;
    }

    addMatch(match: Match) {
        try {
            addDoc(
                collection(this.firestore, 'matches'), {
                playerId1: match.playerId1,
                player1Nickname: match.player1Nickname,
                playerId2: match.playerId2,
                player2Nickname: match.player2Nickname,
                scoreP1: match.scoreP1,
                scoreP2: match.scoreP2,
                islaP1: match.islaP1,
                islaP2: match.islaP2,
                winner: match.winner,
                date: new Date()
            });
        } catch (err) {
            console.log("Error adding match", err);
        }
    }
}