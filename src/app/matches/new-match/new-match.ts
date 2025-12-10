import { Component, ElementRef, Renderer2, inject } from '@angular/core';
import { MatchesService } from '../matches.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PlayersService } from '../../players/players.service';
import { StatsService } from '../../stats/stats.service';
import { Player } from '../../players/players-list/player-item/player.model';

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
  players = this.playersService.players;

  matchForm = new FormGroup({
    player1: new FormControl<string>('', { validators: [Validators.required] }),
    player2: new FormControl<string>('', { validators: [Validators.required] }),
    scoreP1: new FormControl('', { validators: [Validators.required] }),
    scoreP2: new FormControl('', { validators: [Validators.required] }),
    islaP1: new FormControl(false),
    islaP2: new FormControl(false),
  })


  onSubmit() {
    if (this.matchForm.valid) {

      const { player1, player2, scoreP1, scoreP2, islaP1, islaP2 } = this.matchForm.value;

      const p1Id = player1!;
      const p2Id = player2!;
      const s1 = Number(scoreP1);
      const s2 = Number(scoreP2);

      this.statsService.createOrUpdate(p1Id, {
        puntos_favor_totales: s1,
        puntos_contra_totales: s2,
        partidas_jugadas: 1,
        partidas_ganadas: s1 > s2 ? 1 : 0,
        partidas_perdidas: s2 > s1 ? 1 : 0,
        islas: islaP1 ? 1 : 0,
      });

      this.statsService.createOrUpdate(p2Id, {
        puntos_favor_totales: s2,
        puntos_contra_totales: s1,
        partidas_jugadas: 1,
        partidas_ganadas: s2 > s1 ? 1 : 0,
        partidas_perdidas: s1 > s2 ? 1 : 0,
        islas: islaP2 ? 1 : 0,
      });

      this.matchesService.addMatch({
        player1: p1Id,
        player2: p2Id,
        scoreP1: s1,
        scoreP2: s2,
        islaP1: this.matchForm.value.islaP1 ?? false,
        islaP2: this.matchForm.value.islaP2 ?? false,
        winner: s1 > s2 ? p1Id : p2Id,
      })
      this.matchForm.reset();
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
