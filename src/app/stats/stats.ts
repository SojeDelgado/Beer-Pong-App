import { Component, computed, inject, input } from '@angular/core';
import { StatsService } from './stats.service';
import { StatComponent } from "./stat/stat";

@Component({
  selector: 'app-stats',
  imports: [StatComponent],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats{
  statsService = inject(StatsService);
  playerId = input.required<string>();
  
  // path parameters doesnt work by default with child routes. We need to specify that.
  // pass withRouterConfig() to app.config.ts
  // We need to configure paramsInheritanceStrategy to 'always'
  // And this will then ensure that those path parameters values are injected into child routes.
  playerStats = computed( () =>
    this.statsService.allStats()?.filter( stat => stat.playerId === this.playerId() )
  );

  // Intente hacerlo de esta manera, pero combinaba signals con observables.
  // Converti en señal el observable que arroja la base de datos en stats.service.

  // playerStats = computed(() =>
  //   this.statsService.getPlayerStats()
  //     .pipe()
  //     .subscribe(
  //       statsCollection => statsCollection
  //         .filter(
  //           stats => stats.playerId === this.playerId()
  //         ))
  // );
}
