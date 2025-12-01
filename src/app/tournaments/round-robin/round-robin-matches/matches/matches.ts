import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { RoundRobinService } from '../../round-robin.service';
import { Match } from '../../../../matches/matches-list/match/match.model';
import { LeaderboardComponent } from "../../../leaderboard/leaderboard";

@Component({
  selector: 'app-matches',
  imports: [LeaderboardComponent],
  templateUrl: './matches.html',
  styleUrl: './matches.css',
})
export class Matches {
  private roundRobinService = inject(RoundRobinService);
  roundRobinId = input.required<string>();

  matches = signal<Match[]>([]);

  constructor() {
    effect((onCleanup) => {
      if (this.roundRobinId()) {
        const subscription = this.roundRobinService.getMatchesForTournament(this.roundRobinId())
          .subscribe(
            {
              next: (matches) => this.matches.set(matches),
            }
          );

        onCleanup(() => {
          subscription.unsubscribe();
        });
      }
    })
  }
}
