import { Component, inject, signal } from '@angular/core';
import { RoundRobinList } from "./round-robin-list/round-robin-list";
import { RouterOutlet } from '@angular/router';
import { SelectPlayers } from "../select-players/select-players";
import { RoundRobinForm } from "./round-robin-form/round-robin-form";
import { NgClass } from '@angular/common';
import { MatchUp } from '../matchup.model';
import { RoundRobinService } from './round-robin.service';


@Component({
  selector: 'app-round-robin',
  imports: [RoundRobinList, RouterOutlet, SelectPlayers, RoundRobinForm, NgClass],
  templateUrl: './round-robin.html',
  styleUrl: './round-robin.css',
})
export class RoundRobinComponent {
  private roundRobinService = inject(RoundRobinService);
  playerIds = signal<string[]>([]);
  matchups: MatchUp[] = [];
  isAddingMatch = false

  onSelectedPlayers(playerIds: string[]) {
    this.playerIds.set(playerIds);

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

  onStartAddMatchWindow() {
    this.isAddingMatch = true
  }

  onCloseAddMatchWindow() {
    this.isAddingMatch = false
  }
}
