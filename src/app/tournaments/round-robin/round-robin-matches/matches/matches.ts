import { Component, inject, input, OnInit, Signal, signal } from '@angular/core';
import { Match } from '../../../../matches/matches-list/match/match.model';
import { RoundRobinService } from '../../round-robin.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { LeaderboardComponent } from "../../../leaderboard/leaderboard";

@Component({
  selector: 'app-matches',
  templateUrl: './matches.html',
  styleUrl: './matches.css',
  imports: [LeaderboardComponent],
})
export class Matches {
  roundRobinService = inject(RoundRobinService);
  roundRobinId = input.required<string>();

  matches = toSignal(
    toObservable(this.roundRobinId).pipe(
      switchMap(id => this.roundRobinService.getMatchesById(id))
    ),
    { initialValue: [] as [] }
  );
}
