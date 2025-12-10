import { Component, computed, inject, input } from '@angular/core';
import { LeaderboardService } from './leaderboard.service';
import { Match } from '../../matches/matches-list/match/match.model';
import { Results } from './leaderboard.model';

@Component({
  selector: 'app-leaderboard',
  imports: [],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class LeaderboardComponent {
  leaderboardService = inject(LeaderboardService);

  matches = input.required<Results[]>();

  leaderboard = computed(() => {
    const currentMatches = this.matches();
    return this.leaderboardService.generateLeaderboard(currentMatches);
  });
}



