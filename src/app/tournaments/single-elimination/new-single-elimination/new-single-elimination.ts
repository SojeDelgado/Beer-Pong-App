import { Component, inject, signal } from '@angular/core';
import { SingleEliminationService } from '../single-elimination.service';
import { inputTournamentData, SelectPlayers } from "../../select-players/select-players";
import { ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-single-elimination',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, SelectPlayers],
  templateUrl: './new-single-elimination.html',
  styleUrl: './new-single-elimination.css',
})
export class NewSingleElimination {
  private singleEliminationService = inject(SingleEliminationService);
  players = signal<string[]>([]);

  onSelectedPlayers(tournamentData: inputTournamentData) {
    this.players.set(tournamentData.players);

    this.singleEliminationService.createTournamentWithMatchups({
      name: tournamentData.name,
      place: tournamentData.place,
      type: this.singleEliminationService.type,
      playersIds: tournamentData.players
    });
  }
}
