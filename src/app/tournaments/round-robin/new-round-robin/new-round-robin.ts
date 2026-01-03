import { Component, inject, signal } from '@angular/core';
import { RoundRobinForm } from "./round-robin-form/round-robin-form";
import { SelectPlayers } from "../../select-players/select-players";
import { MatchUp } from '../../matchup.model';
import { RoundRobinService } from '../round-robin.service';

@Component({
  selector: 'app-new-round-robin',
  imports: [RoundRobinForm, SelectPlayers],
  templateUrl: './new-round-robin.html',
  styleUrl: './new-round-robin.css',
})
export class NewRoundRobin {
  private roundRobinService = inject(RoundRobinService);
  players = signal<string[]>([]);
  matchups: MatchUp[] = [];


  onSelectedPlayers(playerIds: string[]) {
    this.players.set(playerIds);
    this.roundRobinService.generateMatchups(playerIds)
      .subscribe({
        next: (matchups) => {
          this.matchups = matchups;
        },
        error: (err) => {
          console.error(err);
        }
      })
  }

}
