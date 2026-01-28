// @Angular
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
// Component
import { LeaderboardComponent } from "../../../leaderboard/leaderboard";
// Service
import { RoundRobinService } from '../../round-robin.service';
// Model
import { NewTournament } from '../../../tournament.model'; 
import { Results } from '../../../leaderboard/leaderboard.model';
import { MatchUp } from '../../../matchup.model';
import { NewMatch } from '../../../../matches/matches-list/match/match.model';

interface ResultFormValue {
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
}

@Component({
  selector: 'app-round-robin-form',
  imports: [ReactiveFormsModule, NgClass, LeaderboardComponent],
  templateUrl: './round-robin-form.html',
  styleUrl: './round-robin-form.css',
})
export class RoundRobinForm implements OnInit {
  private roundRobinService = inject(RoundRobinService);
  matchups = input.required<MatchUp[]>();
  resultsForLeaderboard = signal<Results[]>([]);
  tournamentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.tournamentForm = this.fb.group({
      name: new FormControl('', { validators: Validators.required }),
      place: new FormControl('', { validators: Validators.required }),
      matches: this.fb.array([], { validators: Validators.required })
    });
  }

  ngOnInit() {
    this.buildForm();
  }

  get matches(): FormArray {
    return this.tournamentForm.get('matches') as FormArray;
  }

  buildForm() {
    const matchupsData = this.matchups();

    if (matchupsData && matchupsData.length) {
      this.matches.clear();

      matchupsData.forEach(matchup => {
        this.matches.push(this.createMatchFormGroup(matchup));
      });

      this.updateLeaderboardData();
    }
  }

  private createMatchFormGroup(matchup: MatchUp): FormGroup {
    return this.fb.group({
      home: [matchup.home?.id],
      away: [matchup.away?.id],
      homeScore: ["", [Validators.required, Validators.min(0), Validators.max(10)]],
      awayScore: ["", [Validators.required, Validators.min(0), Validators.max(10)]],
      homeIsla: [false],
      awayIsla: [false],
      home2in1: [false],
      away2in1: [false],
      home3in1: [false],
      away3in1: [false],
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
    const formValues = this.matches.getRawValue() as ResultFormValue[];
    const matchups = this.matchups();
    const results: Results[] = formValues.map((value, index) => {
      const matchup = matchups[index];

      return {
        home: matchup.home,
        away: matchup.away,
        homeScore: Number(value.homeScore),
        awayScore: Number(value.awayScore),
      };
    });

    this.resultsForLeaderboard.set(results);
  }

  matchHasBeenSubmited(index: number) {
    const matchGroup = this.matches.at(index);
    return !matchGroup.invalid && matchGroup.pristine && matchGroup.touched;
  }

  onSubmit(): void {
    const matches: NewMatch[] = this.tournamentForm.get('matches')?.value;
    const newTournament: NewTournament = {
      name: this.tournamentForm.get('name')?.value,
      place: this.tournamentForm.get('place')?.value,
      type: this.roundRobinService.type,
      matches: matches
    }

    console.log("Enviando torneo:", newTournament);
    // this.roundRobinService.createTournament(newTournament);

    this.tournamentForm.reset();
  }
}
