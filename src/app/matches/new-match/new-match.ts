import { Component, inject } from '@angular/core';
import { MatchesService } from '../matches.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PlayersService } from '../../players/players.service';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-new-match',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new-match.html',
  styleUrl: './new-match.css',
})
export class NewMatch {
  private router = inject(Router);
  matchesService = inject(MatchesService);
  playersService = inject(PlayersService);
  players = this.playersService.players;

  matchForm = new FormGroup({
    player1: new FormControl<string>('', { validators: [Validators.required] }),
    player2: new FormControl<string>('', { validators: [Validators.required] }),
    scoreP1: new FormControl('', { validators: [Validators.required, Validators.min(0), Validators.max(10)] }),
    scoreP2: new FormControl('', { validators: [Validators.required, Validators.min(0), Validators.max(10)] }),
    islaP1: new FormControl(false),
    islaP2: new FormControl(false),
    home2in1: new FormControl(false),
    away2in1: new FormControl(false),
    home3in1: new FormControl(false),
    away3in1: new FormControl(false),
  })


  onSubmit() {
    if (this.matchForm.valid) {

      const { player1, player2, scoreP1, scoreP2, islaP1, islaP2, home2in1, away2in1, home3in1, away3in1 } = this.matchForm.value;

      const p1Id = player1!;
      const p2Id = player2!;
      const s1 = Number(scoreP1);
      const s2 = Number(scoreP2);

      this.matchesService.addMatch({
        home: p1Id,
        away: p2Id,
        homeScore: s1,
        awayScore: s2,
        homeIsla: islaP1 ?? false,
        awayIsla: islaP2 ?? false,
        home2in1: home2in1 ?? false,
        away2in1: away2in1 ?? false,
        home3in1: home3in1 ?? false,
        away3in1: away3in1 ?? false,
      }).subscribe({
        next: () => this.matchesService.notifyChange()
      })

      this.matchForm.reset();
      this.router.navigate(['matches']);
    }
    return;
  }
}
