import { Component, ElementRef, Renderer2, inject } from '@angular/core';
import { MatchesService } from '../matches.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PlayersService } from '../../players/players.service';
import { StatsService } from '../../stats/stats.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-new-match',
  imports: [ReactiveFormsModule],
  templateUrl: './new-match.html',
  styleUrl: './new-match.css',
})
export class NewMatch {
  matchesService = inject(MatchesService);
  playersService = inject(PlayersService);
  statsService = inject(StatsService);
  players = toSignal(this.playersService.players$);

  matchForm = new FormGroup({
    player1Id: new FormControl('', {
      validators: [Validators.required],
    }),

    player2Id: new FormControl('', {
      validators: [Validators.required],
    }),

    scoreP1: new FormControl('', {
      validators: [Validators.required],
    }),

    scoreP2: new FormControl('', {
      validators: [Validators.required],
    }),

    islaP1: new FormControl(false),
    islaP2: new FormControl(false),
  })

  winner() {
    const p1Score = Number(this.matchForm.value.scoreP1);
    const p2Score = Number(this.matchForm.value.scoreP2);
    const p1Id = this.matchForm.value.player1Id ?? '';
    const p2Id = this.matchForm.value.player2Id ?? '';
    const islaP1 = this.matchForm.value.islaP1 ?? false;
    const islaP2 = this.matchForm.value.islaP2 ?? false;

    if (p1Score > p2Score) {
      this.statsService.updatePlayerStats(p1Id, true, islaP1, p1Score, p2Score);  // Winner
      this.statsService.updatePlayerStats(p2Id, false, islaP2, p2Score, p1Score); // Loser
      return p1Id;
    } else {
      this.statsService.updatePlayerStats(p1Id, false, islaP1, p1Score, p2Score); // Loser
      this.statsService.updatePlayerStats(p2Id, true, islaP2, p2Score, p1Score);  // Winner
      return p2Id;
    }
  }

  onSubmit() {
    if (this.matchForm.valid) {
      const formValue = this.matchForm.value;
      const p1Id = formValue.player1Id;
      const p2Id = formValue.player2Id;

      const p1Obj = this.players()?.find(p => p.id === p1Id);
      const p2Obj = this.players()?.find(p => p.id === p2Id);

      this.matchesService.addMatch(
        {
          playerId1: p1Id ?? "",
          player1Nickname: p1Obj?.nickname ?? "",
          playerId2: p2Id ?? "",
          player2Nickname: p2Obj?.nickname ?? "",
          scoreP1: Number(this.matchForm.value.scoreP1) ?? 0,
          scoreP2: Number(this.matchForm.value.scoreP2) ?? 0,
          islaP1: this.matchForm.value.islaP1 ?? false,
          islaP2: this.matchForm.value.islaP2 ?? false,
          winner: this.winner(),
          date: Timestamp.now(),
        }
      )
      this.onCloseWindow();
    }
    return;
  }

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  onCloseWindow() {
    this.renderer.addClass(this.el.nativeElement, 'closing');

    setTimeout(() => {
      const closeEvent = new CustomEvent('close', { bubbles: true });
      this.el.nativeElement.dispatchEvent(closeEvent);
    }, 300);
  }

}
