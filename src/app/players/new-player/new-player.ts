import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PlayersService } from '../players.service';

@Component({
  selector: 'app-new-player',
  imports: [ReactiveFormsModule],
  templateUrl: './new-player.html',
  styleUrl: './new-player.css',
})
export class NewPlayer {
  playerService = inject(PlayersService);

  playerForm = new FormGroup({
    nickname: new FormControl('', { 
      validators: [Validators.required], 
    }),
  });

  onSubmit() {
    if(this.playerForm.valid){
      this.playerService.addPlayer(this.playerForm.value.nickname?.toString() ?? "");
      this.playerForm.reset();
    }
  }
}
