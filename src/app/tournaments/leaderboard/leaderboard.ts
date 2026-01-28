import { Component, computed, inject, input, OnInit } from '@angular/core';
import { LeaderboardService } from './leaderboard.service';
import { Results } from './leaderboard.model';

@Component({
  selector: 'app-leaderboard',
  imports: [],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class LeaderboardComponent {
  leaderboardService = inject(LeaderboardService);
  results = input.required<Results[]>();
  leaderboard = computed(() => {
    const currentResults = this.results();
    return this.leaderboardService.generateLeaderboard(currentResults);
  });

}