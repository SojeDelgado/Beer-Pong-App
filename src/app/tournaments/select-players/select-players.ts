import { Component, inject, output } from '@angular/core';
import { PlayersService } from '../../players/players.service';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Routing
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-select-players',
  imports: [ReactiveFormsModule],
  templateUrl: './select-players.html',
  styleUrl: './select-players.css',
})

export class SelectPlayers {
  // Routing
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  // Service
  private playersService = inject(PlayersService);
  private formBuilder = inject(FormBuilder);
  allPlayers = this.playersService.players;
  selectedPlayers = output<inputTournamentData>();

  playersForm = new FormGroup({
    name: new FormControl('', { validators: Validators.required }),
    place: new FormControl('', { validators: Validators.required }),

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
    const { name, place, players } = this.playersForm.value

    this.selectedPlayers.emit({
      name: name ?? "",
      place: place ?? "",
      players: players ?? []
    });

    this.router.navigate(['..'], {relativeTo: this.route});
  }
}

export interface inputTournamentData {
  name: string,
  place: string,
  players: string[]
}