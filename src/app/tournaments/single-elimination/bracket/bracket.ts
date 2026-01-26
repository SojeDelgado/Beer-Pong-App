import { Component, computed, inject, input } from '@angular/core';
import { SingleEliminationService } from '../single-elimination.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MatchUpdate } from "../new-single-elimination/match-update/match-update";
import { SingleEliminationMatch } from '../../../matches/matches-list/match/match.model';
import { NgClass } from '@angular/common';
import { TournamentStatus } from '../../models/update-tournament-model';

@Component({
  selector: 'app-bracket',
  imports: [MatchUpdate, NgClass],
  templateUrl: './bracket.html',
  styleUrl: './bracket.css',
})
export class Bracket {
  singleEliminationId = input.required<string>();
  singleEliminationService = inject(SingleEliminationService);

  status = toSignal<any>(
    toObservable(this.singleEliminationId).pipe(
      switchMap(id => this.singleEliminationService.getTournamentStatus(id))
    )
  );

  matches = toSignal(
    toObservable(this.singleEliminationId).pipe(
      switchMap(id => this.singleEliminationService.getMatchesById(id))
    ),
    { initialValue: [] as [] }
  );

  rounds = computed(() => {
    const groups = this.matches().reduce((acc, match) => {
      if (!acc[match.round]) acc[match.round] = [];
      acc[match.round].push(match);
      return acc;
    }, {} as Record<number, SingleEliminationMatch[]>);

    return Object.keys(groups)
      .map(key => Number(key))
      .sort((a, b) => a - b)
      .map(round => groups[round]);
  });

  selectedMatch: SingleEliminationMatch | null = null;

  openUpdateModal(match: SingleEliminationMatch) {
    const isReady = !!(match.home?.nickname && match.away?.nickname);
    if (isReady) {
      this.selectedMatch = match;
    }
  }

  closeModal() {
    this.selectedMatch = null;
  }

  getRoundClass(index: number): string {
    const classes = ['one', 'two', 'three', 'four', 'five'];
    return classes[index] || 'one';
  }

  onSubmit() {

    const winner = this.matches()[0].homeScore > this.matches()[0].awayScore
      ? this.matches()[0].home.id : this.matches()[0].away.id;

    this.singleEliminationService.update(this.singleEliminationId(), 
    {
      winner: winner,
      status: TournamentStatus.FINALIZADO
    })
  }

  closeOnBackdrop(event: MouseEvent, dialog: HTMLDialogElement) {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
    );

    if (!isInDialog) {
        dialog.close();
    }
}
}
