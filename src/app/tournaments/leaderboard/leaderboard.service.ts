import { Injectable } from "@angular/core";
import { Leaderboard, Results } from "./leaderboard.model";
import { Player } from "../../players/players-list/player-item/player.model";


@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {  generateLeaderboard(results: Results[]) {
    const statsMap = new Map<string, Leaderboard>();

    const getOrCreatePlayer = (player: Player) => {
      if (!statsMap.has(player.id)) {
        statsMap.set(player.id, {
          playerId: player.id,
          nickname: player.nickname,
          wins: 0,
          losses: 0,
          pFavor: 0,
          pContra: 0,
          diferencia: 0
        });
      }
      return statsMap.get(player.id)!;
    };

    
    results.forEach(result => {
      const home = getOrCreatePlayer(result.home!);
      const away = getOrCreatePlayer(result.away!);

      home.pFavor += result.homeScore;
      home.pContra += result.awayScore;
      home.diferencia = home.pFavor - home.pContra;

      away.pFavor += result.awayScore;
      away.pContra += result.homeScore;
      away.diferencia = away.pFavor - away.pContra;

      if (result.homeScore > result.awayScore) {
        home.wins++;
        away.losses++;
      } else if (result.awayScore > result.homeScore) {
        away.wins++;
        home.losses++;
      }
    });

    // Ordenar
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