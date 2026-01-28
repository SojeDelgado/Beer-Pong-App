import { Component, computed, inject, input } from '@angular/core';
import { RoundRobinMatchesInterface } from '../models/round-robin-matches-model';
import { MatchUpdate } from "../../single-elimination/new-single-elimination/match-update/match-update";
import { UpdateTournamentMatch } from '../../models/update-tournament-matches-model';
import { RoundRobinService } from '../round-robin.service';

@Component({
  selector: 'app-league-table',
  imports: [MatchUpdate],
  templateUrl: './league-table.html',
  styleUrl: './league-table.css',
})
export class LeagueTable {
  // Service
  rrService = inject(RoundRobinService);
  // inputs
  tournamentId = input.required<string>();
  matches = input.required<RoundRobinMatchesInterface[]>();
  status = input.required<any>();

  selectedMatch: RoundRobinMatchesInterface | null = null;
  rounds = computed(() => {
    const map = new Map<number, any[]>();

    for (const match of this.matches()) {
      if (!map.has(match.round)) {
        map.set(match.round, []);
      }
      map.get(match.round)!.push(match);
    }

    return Array.from(map.entries()).map(([round, matches]) => ({
      round,
      matches,
    }));
  });

  openUpdateModal(match: RoundRobinMatchesInterface) {
      const isReady = !!(match.home?.nickname && match.away?.nickname);
      if (isReady) {
        this.selectedMatch = match;
      }
    }

    onMatchSubmit(formData: UpdateTournamentMatch){
      this.rrService.updateTournamentMatch({
        tournamentId: this.tournamentId(),
        homeScore: formData.homeScore,
        awayScore: formData.awayScore,
        homeIsla: formData.homeIsla,
        awayIsla: formData.awayIsla,
        home2in1: formData.home2in1,
        away2in1: formData.away2in1,
        home3in1: formData.home3in1,
        away3in1: formData.away3in1,
        matchId: formData.matchId,
        nextMatchId: null
      })
    }

}
