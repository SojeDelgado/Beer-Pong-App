import { Component, inject, input, OnInit } from '@angular/core';
import { SingleEliminationService } from '../single-elimination.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { Bracket } from "../bracket/bracket";
import { TournamentStatus } from '../../../common/models/update-tournament.model';
import { UpdateTournamentMatch } from '../../models/update-tournament-matches-model';

@Component({
  selector: 'app-single-elimination-bracket-manager',
  imports: [Bracket],
  templateUrl: './single-elimination-bracket-manager.html',
  styleUrl: './single-elimination-bracket-manager.css',
})
export class SingleEliminationBracketManager implements OnInit{
  singleEliminationId = input.required<string>(); // this is a router input
  singleEliminationService = inject(SingleEliminationService);

  matches = toSignal(
    toObservable(this.singleEliminationId).pipe(
      switchMap(id => this.singleEliminationService.getMatchesById(id))
    ),
    { initialValue: [] as [] }
  );

  fields = toSignal<any>(
    toObservable(this.singleEliminationId).pipe(
      switchMap(id => this.singleEliminationService.getSingleEliminationById(id, "status,winner,place"))
    )
  );
  


  ngOnInit(): void {
    this.singleEliminationService.notifyUpdate();
  }

  handleSingleSubmit(matchResults: UpdateTournamentMatch) {
    this.singleEliminationService.updateTournamentMatch(
      this.singleEliminationId(), matchResults.matchId,
    
    {
      homeScore: matchResults.homeScore,
      awayScore: matchResults.awayScore,

      homeIsla: matchResults.homeIsla,
      awayIsla: matchResults.awayIsla,

      home2in1: matchResults.home2in1,
      away2in1: matchResults.away2in1,

      home3in1: matchResults.home3in1,
      away3in1: matchResults.away3in1,
    })
  }

  handleTournamentFinish() {
    const finalMatch = this.matches()[0];
    const winnerId = finalMatch.homeScore > finalMatch.awayScore
      ? finalMatch.home.id
      : finalMatch.away.id;

    this.singleEliminationService.update(
      this.singleEliminationId(), 
    {
      winner: winnerId,
      status: TournamentStatus.FINALIZADO,
      finishedAt: new Date()
    })
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
