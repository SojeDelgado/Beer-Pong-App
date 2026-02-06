import { Component, effect, EnvironmentInjector, inject, input } from '@angular/core';
import { RoundRobinService } from '../round-robin.service';
import { LeagueTable } from "../league-table/league-table";
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { LeaderboardComponent } from "../../leaderboard/leaderboard";
import { Bracket } from "../../single-elimination/bracket/bracket";
import { UpdateTournamentMatch } from '../../models/update-tournament-matches-model';
import { TournamentStatus } from '../../../common/models/update-tournament.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-round-robin-manager',
  imports: [LeagueTable, LeaderboardComponent, Bracket, ReactiveFormsModule],
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

  seMatches = toSignal(
    toObservable(this.roundRobinId).pipe(
      switchMap(id => this.rrService.getSingleEliminationMatches(id))
    ), { initialValue: [] = [] }
  )

  fields = toSignal(
    toObservable(this.roundRobinId).pipe(
      switchMap(id => this.rrService.getRoundRobinById(id, 'status,winner,totalPlayers'))
    )
  )


  playersForm = new FormGroup({
    totalFinalist: new FormControl(0, [Validators.required, Validators.min(2)])
  });

  get totalFinalist() {
    return this.playersForm.get('totalFinalist') as FormControl;
  }

  constructor() {
    effect(() => {
      const data = this.fields();
      // Verificamos que existan datos y que el control esté definido
      if (data?.totalPlayers && this.totalFinalist) {
        this.totalFinalist.setValidators([
          Validators.required,
          Validators.min(2),
          Validators.max(data.totalPlayers)
        ]);
        // Forzamos al formulario a re-evaluar el estado
        this.totalFinalist.updateValueAndValidity();
      }
    });
  }


  handleSingleSubmit(matchResults: UpdateTournamentMatch) {
    this.rrService.updateSingleEliminationMatch(
      this.roundRobinId(), matchResults.matchId,
      {
        homeScore: matchResults.homeScore,
        awayScore: matchResults.awayScore,

        homeIsla: matchResults.homeIsla,
        awayIsla: matchResults.awayIsla,

        home2in1: matchResults.home2in1,
        away2in1: matchResults.away2in1,

        home3in1: matchResults.home3in1,
        away3in1: matchResults.away3in1,
      }
    )
  }

  handleClasificationFinish() {
    const { totalFinalist } = this.playersForm.value
    console.log("Clasificacion terminada");
    this.rrService.promotePlayers( this.roundRobinId() , totalFinalist!);
  }

  handleTournamentFinish() {
    const finalMatch = this.seMatches()[0];
    const winnerId = finalMatch.homeScore > finalMatch.awayScore
      ? finalMatch.home.id
      : finalMatch.away.id;

    this.rrService.update(
      this.roundRobinId(),
      {
        winner: winnerId,
        status: TournamentStatus.FINALIZADO,
        finishedAt: new Date()
      }
    )
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
