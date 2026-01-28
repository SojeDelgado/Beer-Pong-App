import { Component, computed, input, output } from '@angular/core';
import { MatchUpdate } from "../new-single-elimination/match-update/match-update";
import { SingleEliminationMatch } from '../../../matches/matches-list/match/match.model';
import { NgClass } from '@angular/common';
import { UpdateTournamentMatch } from '../../models/update-tournament-matches-model';


@Component({
  selector: 'app-bracket',
  imports: [MatchUpdate, NgClass],
  templateUrl: './bracket.html',
  styleUrl: './bracket.css',
})
export class Bracket {
  // inputs
  tournamentId = input.required<string>();
  matches = input.required<SingleEliminationMatch[]>();
  status = input.required<any>();
  // output
  submitUpdate = output<UpdateTournamentMatch>();

  // variables para la funcionalidad del bracket
  selectedMatch: SingleEliminationMatch | null = null;
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

  onSingleSubmit(formData: UpdateTournamentMatch){
    this.submitUpdate.emit(formData);
  }

}
