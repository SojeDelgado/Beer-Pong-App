import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Player } from './players-list/player-item/player.model';
// RXJS
import { Observable } from 'rxjs';
// Firebase
import { Firestore, collectionData, collection, addDoc, doc, docData, deleteDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  players$ = collectionData(
    collection(this.firestore, "players"),
    { idField: 'id' }
  ) as Observable<Player[]>;

  async addPlayer(nickname: string) {
    try {
      const docRef = addDoc(collection(this.firestore, "players"), {
        nickname: nickname,
      });
      console.log("Document written with ID: ", (await docRef).id);
    } catch (e) {
      console.error("Error adding player: ", e);
    }
  }

  async deletePlayer(playerId: string) {
    try {
      const playerDocRef = doc(this.firestore, `players/${playerId}`);
      await deleteDoc(playerDocRef);
    } catch (e) {
      console.error("Error deleting player", e);
    }
  }

  getPlayerById(id: string): Observable<Player> {
    return runInInjectionContext( this.injector, () => {
      const playerRef = doc(this.firestore, `players/${id}`);
      return docData(playerRef, { idField: 'id' }) as Observable<Player>;
    })
  }
}
