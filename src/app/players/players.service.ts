import { inject, Injectable, signal } from '@angular/core';
import { Player } from './players-list/player-item/player.model';
// RXJS
import { Observable } from 'rxjs';
// Http
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
// Sockets
import { io } from 'socket.io-client';


@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private socket = io(environment.apiurl);
  private playersUrl = `${environment.apiurl}/players`;

  private httpClient = inject(HttpClient)

  private playersSignal = signal<Player[]>([]);
  players = this.playersSignal.asReadonly();

  constructor() {
    this.loadInitialPlayers();
    this.setupSocketListeners();
  }

  private loadInitialPlayers() {
    this.httpClient.get<Player[]>(this.playersUrl).subscribe(data => {
      this.playersSignal.set(data);
    });
  }

  private setupSocketListeners() {
    this.socket.on('playerAdded', (newPlayer: any) => {
      const normalizedPlayer = {
        ...newPlayer,
        id: newPlayer.id || newPlayer._id
      };

      this.playersSignal.update(current => [...current, normalizedPlayer]);
    });
  }

  async addPlayer(nickname: string) {
    return this.httpClient.post(this.playersUrl, { nickname }).subscribe({
      next: (response) => {
        console.log(response);
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
