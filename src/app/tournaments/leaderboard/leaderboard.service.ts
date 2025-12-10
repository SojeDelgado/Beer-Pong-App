import { Injectable } from "@angular/core";
import { Leaderboard, Results } from "./leaderboard.model";
import { Match } from "../../matches/matches-list/match/match.model";




@Injectable({
    providedIn: 'root',
})
export class LeaderboardService {

    generateLeaderboard(results: Results[]) {
    const statsMap = new Map<string, Leaderboard>();

    const getOrCreatePlayer = (id: string, nickname: string) => {
      if (!statsMap.has(id)) {
        statsMap.set(id, {
          playerId: id,
          nickname: nickname,
          wins: 0,
          losses: 0,
          pFavor: 0,
          pContra: 0,
          diferencia: 0
        });
      }
      return statsMap.get(id)!;
    };

    results.forEach(result => {
      const home = getOrCreatePlayer(result.playerId1, result.player1Nickname);
      const away = getOrCreatePlayer(result.playerId2, result.player2Nickname);

      home.pFavor += result.scoreP1;
      home.pContra += result.scoreP2;
      home.diferencia = home.pFavor - home.pContra;

      away.pFavor += result.scoreP2;
      away.pContra += result.scoreP1;
      away.diferencia = away.pFavor - away.pContra;

      if (result.scoreP1 > result.scoreP2) {
        home.wins++;
        away.losses++;
      } else if (result.scoreP2 > result.scoreP1){
        away.wins++;
        home.losses++;
      }
    });

    // Ordenamos segun sea el caso
    return Array.from(statsMap.values()).sort((a, b) => {
      // Más victorias arriba
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      // O mejor diferencia de puntos
      return b.diferencia - a.diferencia;
    });
  }

}