import { Component, inject, output } from '@angular/core';
import { PlayersService } from '../../players/players.service';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-players',
  imports: [ReactiveFormsModule],
  templateUrl: './select-players.html',
  styleUrl: './select-players.css',
})
export class SelectPlayers {
  private playersService = inject(PlayersService);
  allPlayers = this.playersService.players;

  private formBuilder = inject(FormBuilder);

  selectedPlayers = output<string[]>();


  playersForm = new FormGroup({
    players: new FormArray<FormControl<any>>([], {
      validators: [Validators.required],
    }),
  });

  get players() {
    return this.playersForm.get('players') as FormArray;
  }

  addPlayer(playerId: string) {
    this.players.push(this.formBuilder.control(playerId))
  }

  removePlayer(index: number) {
    this.players.removeAt(index);
  }

  onCheckChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const playerId = input.value;

    if (input.checked) {
      this.addPlayer(playerId);

    } else {
      const index = this.players.controls.findIndex(ctrl => ctrl.value === playerId);
      this.removePlayer(index);
    }
  }

  OnSubmit() {
    this.selectedPlayers.emit(this.players.value);
  }
}
