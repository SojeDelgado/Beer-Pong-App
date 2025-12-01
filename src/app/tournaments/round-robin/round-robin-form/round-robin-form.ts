// @Angular
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
// Component
import { LeaderboardComponent } from "../../leaderboard/leaderboard";
// Service
import { RoundRobinService } from '../round-robin.service';
import { StatsService } from '../../../stats/stats.service';
// Model
import { Tournament } from '../../tournament.service';
import { Pairings } from '../../pairings.model';
import { Match } from '../../../matches/matches-list/match/match.model';

@Component({
  selector: 'app-round-robin-form',
  imports: [ReactiveFormsModule, NgClass, LeaderboardComponent],
  templateUrl: './round-robin-form.html',
  styleUrl: './round-robin-form.css',
})
export class RoundRobinForm implements OnInit {
  private roundRobinService = inject(RoundRobinService);
  private statsService = inject(StatsService);
  pairings = input.required<Pairings[]>();
  matchesResults = output<Match[]>();
  matchesForLeaderboard = signal<Match[]>([]);

  tournamentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.tournamentForm = this.fb.group({
      name: new FormControl('', {validators: Validators.required}),
      place: new FormControl('', {validators: Validators.required}),
      matches: this.fb.array([], {validators: Validators.required})
    });
  }

  ngOnInit() {
    this.buildForm();
  }

  get matches(): FormArray {
    return this.tournamentForm.get('matches') as FormArray;
  }

  buildForm() {
    const pairingsData = this.pairings();

    if (pairingsData && pairingsData.length) {
      this.matches.clear();

      pairingsData.forEach(pairing => {
        this.matches.push(this.createMatchFormGroup(pairing));
      });

      this.updateLeaderboardData();
    }
  }

  private createMatchFormGroup(pairing: Pairings): FormGroup {
    return this.fb.group({
      playerId1: [pairing.playerId1],
      playerId2: [pairing.playerId2],
      player1Nickname: [pairing.player1Nickname],
      player2Nickname: [pairing.player2Nickname],
      scoreP1: ["", [Validators.required, Validators.min(0), Validators.max(10)]],
      scoreP2: ["", [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  onSingleSubmit(index: number): void {
    const matchGroup = this.matches.at(index);

    if (matchGroup.valid) {
      this.updateLeaderboardData();
      matchGroup.markAsPristine();
    } else {
      console.log('Partido invalido');
    }
  }

  private updateLeaderboardData() {
    const allMatchesData = this.matches.getRawValue() as Match[];
    this.matchesForLeaderboard.set(allMatchesData);
    this.matchesResults.emit(allMatchesData);
  }

  matchHasBeenSubmited(index: number) {
    const matchGroup = this.matches.at(index);
    return !matchGroup.invalid && matchGroup.pristine && matchGroup.touched;
  }

  onSubmit(): void {
    const matches: Match[] = this.tournamentForm.get('matches')?.value;
    console.log('Matches:', matches)
    const newTournament: Tournament = {
      name: this.tournamentForm.get('name')?.value,
      place: this.tournamentForm.get('place')?.value,
      type: "ROUND_ROBIN",
      date: new Date()
    }
    this.tournamentForm.reset();
    this.roundRobinService.saveTournamentAndMatches(newTournament, matches);
    this.statsService.updatePlayerStatsByMatches(matches);
  }
}
