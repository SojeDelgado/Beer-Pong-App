import { Injectable } from "@angular/core";
import { Leaderboard } from "./leaderboard.model";
import { Match } from "../../matches/matches-list/match/match.model";


@Injectable({
    providedIn: 'root',
})
export class LeaderboardService {

    generateLeaderboard(matches: Match[]) {
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

    matches.forEach(match => {
      const home = getOrCreatePlayer(match.playerId1, match.player1Nickname);
      const away = getOrCreatePlayer(match.playerId2, match.player2Nickname);

      home.pFavor += match.scoreP1;
      home.pContra += match.scoreP2;
      home.diferencia = home.pFavor - home.pContra;

      away.pFavor += match.scoreP2;
      away.pContra += match.scoreP1;
      away.diferencia = away.pFavor - away.pContra;

      if (match.scoreP1 > match.scoreP2) {
        home.wins++;
        away.losses++;
      } else if (match.scoreP2 > match.scoreP1){
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