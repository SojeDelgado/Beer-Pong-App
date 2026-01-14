import { Component, inject, signal } from '@angular/core';
import { SingleEliminationService } from '../single-elimination.service';
import { SelectPlayers } from "../../select-players/select-players";
import { FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-single-elimination',
  imports: [SelectPlayers, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './new-single-elimination.html',
  styleUrl: './new-single-elimination.css',
})
export class NewSingleElimination {
  private singleEliminationService = inject(SingleEliminationService);
  players = signal<string[]>([]);
  tournamentId = signal<string>("");

  singleEliminationForm = new FormGroup({
    name: new FormControl<string>(''),
    place: new FormControl<string>('')
  })


  onSelectedPlayers(playerIds: string[]) {
    this.players.set(playerIds);

    this.singleEliminationService.createTournamentWithMatchups({
      name: this.singleEliminationForm.value.name?? "",
      type: this.singleEliminationService.type,
      place: this.singleEliminationForm.value.place?? "",
      playersIds: playerIds
    }).subscribe({
      next: (tournamentId) => {
        this.tournamentId.set(tournamentId);
        console.log('Torneo creado - id:', tournamentId);
      },
      error: (err) => console.error('Error en la creación:', err)
    });
  }
}
