import { inject, Injectable } from '@angular/core';
import { Player } from './players-list/player-item/player.model';
// RXJS
import { Observable } from 'rxjs';
// Http
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private httpClient = inject(HttpClient)

  private playersUrl = `${environment.apiurl}/players`;
  players = toSignal<Player[]>(this.getAllPlayers());

  private getAllPlayers(): Observable<Player[]> {
    return this.httpClient.get<Player[]>(this.playersUrl);
  }

  async addPlayer(nickname: string, firstname: string, lastname: string) {
    return this.httpClient.post(this.playersUrl, { nickname, firstname, lastname }).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  
  getPlayerById(id: string): Observable<Player> {
    return this.httpClient.get<Player>(`${this.playersUrl}/${id}`)
  }

  async deletePlayer(playerId: string) {
    return;
  }

}
