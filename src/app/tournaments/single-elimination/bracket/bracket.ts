import { Component, computed, inject, input } from '@angular/core';
import { SingleEliminationService } from '../single-elimination.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MatchUpdate } from "../new-single-elimination/match-update/match-update";
import { SingleEliminationMatch } from '../../../matches/matches-list/match/match.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-bracket',
  imports: [MatchUpdate, NgClass],
  templateUrl: './bracket.html',
  styleUrl: './bracket.css',
})
export class Bracket {
  singleEliminationId = input.required<string>();
  singleEliminationService = inject(SingleEliminationService);

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
}
