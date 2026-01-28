import { inject, Injectable, signal } from '@angular/core';
import { Player } from './players-list/player-item/player.model';
// Http
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
// RXJS
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private playersUrl = `${environment.apiurl}/players`;

  private httpClient = inject(HttpClient)

  private playersSignal = signal<Player[]>([]);
  players = this.playersSignal.asReadonly();

  constructor() {
    this.loadPlayers();
  }

  private loadPlayers() {
    this.httpClient.get<Player[]>(this.playersUrl).subscribe(data => {
      this.playersSignal.set(data);
    });
  }

  async addPlayer(nickname: string) {
    return this.httpClient.post(this.playersUrl, { nickname }).subscribe({
      next: () => {
        this.loadPlayers();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getPlayerById(id: string): Observable<Player> {
    return this.httpClient.get<Player>(`${this.playersUrl}/${id}`);
  }

  async deletePlayer(playerId: string) {
    return;
  }
}
