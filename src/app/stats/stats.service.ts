// Angular
import { inject, Injectable, Injector, runInInjectionContext } from "@angular/core";
// Model
import { Stat } from "./stat/stat.model";
// RXJS
import { Observable } from "rxjs";
// Firebase
import { Firestore, collectionData, collection, doc, docData, setDoc, increment, writeBatch } from '@angular/fire/firestore';
import { toSignal } from "@angular/core/rxjs-interop";
import { Match } from "../matches/matches-list/match/match.model";

@Injectable({
    providedIn: 'root',
})
export class StatsService {
    private firestore = inject(Firestore);
    private injector = inject(Injector);
    allStats = toSignal(this.getPlayerStats());

    stats$ = collectionData(
        collection(this.firestore, "players"),
        { idField: 'id' }
    ) as Observable<Stat[]>


    private getPlayerStats(): Observable<Stat[]> {
        const statsRef = collection(this.firestore, 'stats');
        return collectionData(statsRef) as Observable<Stat[]>;
    }

    async updatePlayerStats(playerId: string, isWinner: boolean, isla: boolean, puntosF: number, puntosC: number) {
        return runInInjectionContext(this.injector, async () => {
            try {
                const statsRef = doc(this.firestore, 'stats', playerId);
                await setDoc(statsRef, {
                    playerId: playerId,

                    puntos_favor_totales: increment(puntosF),
                    puntos_contra_totales: increment(puntosC),

                    partidas_jugadas: increment(1),
                    partidas_ganadas: increment(isWinner ? 1 : 0),  // Suma 1 si ganó, 0 si perdió
                    partidas_perdidas: increment(isWinner ? 0 : 1),  // Suma 0 si ganó, 1 si perdió
                    isla: increment(isla ? 1 : 0)
                }, { merge: true }); // Si no existe, lo crea. Si existe, lo actualiza.

            } catch (err) {
                console.error(`Error updating stats for ${playerId}`, err);
            }
        });
    }

    async updatePlayerStatsByMatches(matches: Match[]) {
        return runInInjectionContext(this.injector, async () => {
            try {
                const batch = writeBatch(this.firestore);
                const statsCol = collection(this.firestore, 'stats');
                matches.forEach(match => {
                    // Player 1
                    const statsRefP1 = doc(statsCol, match.playerId1);
                    const statsDataP1 = {
                        playerId: match.playerId1,
                        puntos_favor_totales: increment(match.scoreP1),
                        puntos_contra_totales: increment(match.scoreP2),

                        partidas_jugadas: increment(1),
                        partidas_ganadas: increment(match.scoreP1 > match.scoreP2 ? 1 : 0),
                        partidas_perdidas: increment(match.scoreP2 > match.scoreP1 ? 1 : 0),
                        isla: increment(match.islaP1 ? 1 : 0)
                    };
                    batch.set(statsRefP1, statsDataP1, { merge: true });

                    // Player 2
                    const statsRefP2 = doc(statsCol, match.playerId2);
                    const statsDataP2 = {
                        playerId: match.playerId2,
                        puntos_favor_totales: increment(match.scoreP2),
                        puntos_contra_totales: increment(match.scoreP1),
                        partidas_jugadas: increment(1),
                        partidas_ganadas: increment(match.scoreP2 > match.scoreP1 ? 1 : 0),
                        partidas_perdidas: increment(match.scoreP1 > match.scoreP2 ? 1 : 0),
                        isla: increment(match.islaP2 ? 1 : 0)
                    };
                    batch.set(statsRefP2, statsDataP2, { merge: true });
                });
                await batch.commit();

            } catch (err) {
                console.log("Error al actualizar los stats de los jugadores", err);
                throw err;
            }
        });
    }

    getStatsById(id: string): Observable<Stat> {
        return runInInjectionContext(this.injector, () => {
            const ref = doc(this.firestore, `stats/${id}`);
            return docData(ref) as Observable<Stat>
        })
    }
}