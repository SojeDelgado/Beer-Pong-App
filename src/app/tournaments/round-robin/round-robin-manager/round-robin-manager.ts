import { Component, EnvironmentInjector, inject, input } from '@angular/core';
import { RoundRobinService } from '../round-robin.service';
import { LeagueTable } from "../league-table/league-table";
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { LeaderboardComponent } from "../../leaderboard/leaderboard";

@Component({
  selector: 'app-round-robin-manager',
  imports: [LeagueTable, LeaderboardComponent],
  templateUrl: './round-robin-manager.html',
  styleUrl: './round-robin-manager.css',
})

// Este mismo problema esta dentro de SingleEliminationBracketManager
// Y otra solucion es propuesta en el otro componente
// Al parecer la otra es mejor que esta, ya que esta es como un "parche".


// ngOnInit(): void {
//   // Ejecutar runInInjection para inicializar el input dentro de ngOnInit y pasarlo a toSignal y hacerlo una signal
//   // Ref: https://github.com/angular/angular/issues/50947
//   runInInjectionContext( this.injector, () => {
//     this.matches = toSignal(this.rrService.getMatchesById(this.roundRobinId()));
//     this.status = toSignal(this.rrService.getTournamentStatus(this.roundRobinId()));
//     }
//   )
// }


export class RoundRobinManager {
  injector = inject(EnvironmentInjector);

  roundRobinId = input.required<string>(); // this is a router input
  rrService = inject(RoundRobinService);

  matches = toSignal(
    toObservable(this.roundRobinId).pipe(
      switchMap(id => this.rrService.getRoundRobinMatches(id))
    ), { initialValue: [] = [] }
  )

  fields = toSignal(
    toObservable(this.roundRobinId).pipe(
      switchMap(id => this.rrService.getRoundRobinById(id, 'status'))
    )
  )

  handleTournamentFinish() {
    // ToDo:
    console.log("Finalizado")
  }

  closeOnBackdrop(event: MouseEvent, dialog: HTMLDialogElement) {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );

    if (!isInDialog) {
      dialog.close();
    }
  }

}
