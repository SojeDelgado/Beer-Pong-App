import { Component, inject, output } from '@angular/core';
import { PlayersService } from '../../players/players.service';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-select-players',
  imports: [ReactiveFormsModule],
  templateUrl: './select-players.html',
  styleUrl: './select-players.css',
})
export class SelectPlayers {
  private playersService = inject(PlayersService);
  allPlayers = toSignal(this.playersService.players$);
  private formBuilder = inject(FormBuilder);
  selectedPlayers = output<{ id: string; nickname: string }[]>();


  playersForm = new FormGroup({
    players: new FormArray<FormControl<any>>([], {
      validators: [Validators.required],
    }),
  });

  get players() {
    return this.playersForm.get('players') as FormArray;
  }

  addPlayer(player: {
    id?: string,
    nickname?: string
  }) {
    this.players.push(this.formBuilder.control(player))
  }

  removePlayer(index: number) {
    this.players.removeAt(index);
  }

  onCheckChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const playerId = input.value;
    const player = this.allPlayers()?.find(p => p.id === playerId);

    if (input.checked) {
      this.addPlayer({
        id: player?.id, nickname: player?.nickname
      });

    } else {
      const index = this.players.controls
        .findIndex(ctrl => ctrl.value === player?.id);

      this.removePlayer(index);
    }
  }

  OnSubmit() {
    this.selectedPlayers.emit(this.players.value);
  }
}
