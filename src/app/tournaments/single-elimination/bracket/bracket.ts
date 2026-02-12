import { Component, computed, input, output } from '@angular/core';
import { MatchUpdate } from "../new-single-elimination/match-update/match-update";
import { NgClass } from '@angular/common';
import { UpdateTournamentMatch } from '../../models/update-tournament-matches-model';
import { SingleEliminationMatch } from '../models/single-elimination-match.model';


@Component({
  selector: 'app-bracket',
  imports: [MatchUpdate, NgClass],
  templateUrl: './bracket.html',
  styleUrl: './bracket.css',
})
export class Bracket {
  // inputs
  matches = input.required<SingleEliminationMatch[]>();
  fields = input.required<any>();
  // output
  submitUpdate = output<UpdateTournamentMatch>();

  // variables para la funcionalidad del bracket
  selectedMatchId: number = -1;

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
    this.selectedMatchId = match.matchId;
  }

  closeModal() {
    this.selectedMatchId = -1;
  }

  getRoundClass(index: number): string {
    const classes = ['one', 'two', 'three', 'four', 'five'];
    return classes[index] || 'one';
  }

  onSingleSubmit(formData: UpdateTournamentMatch) {
    this.submitUpdate.emit(formData);
  }

}
