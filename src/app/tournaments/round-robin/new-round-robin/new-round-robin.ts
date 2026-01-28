import { Component, inject, signal } from '@angular/core';
import { RoundRobinService } from '../round-robin.service';
import { inputTournamentData, SelectPlayers } from "../../select-players/select-players";

@Component({
  selector: 'app-new-round-robin',
  imports: [SelectPlayers],
  templateUrl: './new-round-robin.html',
  styleUrl: './new-round-robin.css',
})
export class NewRoundRobin {
  private roundRobinService = inject(RoundRobinService);
  players = signal<string[]>([]);

  onSelectedPlayers(tournamentData: inputTournamentData) {
    this.players.set(tournamentData.players);
    this.roundRobinService.createTournament({
      name: tournamentData.name,
      place: tournamentData.place,
      type: this.roundRobinService.type,
      playersIds: tournamentData.players
    })
  }

}
