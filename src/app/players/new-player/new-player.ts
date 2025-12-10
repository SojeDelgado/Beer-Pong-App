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
    firstname: new FormControl(''),
    lastname: new FormControl('')
  });

  onSubmit() {
    if(this.playerForm.valid){
      const formValue = this.playerForm.value;
      const nickname = formValue.nickname ?? '';
      const firstname = formValue.firstname ?? '';
      const lastname = formValue.lastname ?? '';

      this.playerService.addPlayer(nickname, firstname, lastname);
      this.playerForm.reset();
    }
  }
}
