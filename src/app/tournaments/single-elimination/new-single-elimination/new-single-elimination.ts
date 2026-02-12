// Angular
import { Component, inject, signal } from '@angular/core';
import { ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
// Service
import { SingleEliminationService } from '../single-elimination.service';
// Components
import { inputTournamentData, SelectPlayers } from "../../select-players/select-players";

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
    this.singleEliminationService.createSingleElimination({
      name: tournamentData.name,
      place: tournamentData.place,
      playerIds: tournamentData.players
    }).subscribe({
      next: () => this.singleEliminationService.notifyChange(),
    })
  }
}
