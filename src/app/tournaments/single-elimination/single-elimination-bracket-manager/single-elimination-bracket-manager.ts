import { Component, computed, inject, input, OnInit } from '@angular/core';
import { SingleEliminationService } from '../single-elimination.service';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { Bracket } from "../bracket/bracket";
import { UpdateTournamentMatch } from '../../models/update-tournament-matches-model';
import { SingleEliminationMatch } from '../models/single-elimination-match.model';
import { TournamentFieldsResponse } from '../models/single-elimination-by-id-response';

@Component({
  selector: 'app-single-elimination-bracket-manager',
  imports: [Bracket],
  templateUrl: './single-elimination-bracket-manager.html',
  styleUrl: './single-elimination-bracket-manager.css',
})
export class SingleEliminationBracketManager {
  singleEliminationId = input.required<string>(); // this is a router input
  singleEliminationService = inject(SingleEliminationService);

  matchesResource = rxResource({
    params: () => this.singleEliminationId(),
    stream: () => this.singleEliminationService.getMatchesById(this.singleEliminationId()),
    defaultValue: [] as SingleEliminationMatch[]
  })

  fieldsResource = rxResource({
    params: () => this.singleEliminationId(),
    stream: () => this.singleEliminationService.getSingleEliminationById(this.singleEliminationId(), "status,winner"),
    defaultValue: {} as TournamentFieldsResponse
  })

  matches = computed(() => this.matchesResource.value())
  fields = computed(() => this.fieldsResource.value())

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
      }).subscribe({
        next: () => {
          this.matchesResource.reload();

          // Actualizar unicamente los fields cuando se modifique el ultimo partido
          // Ya que al modificarse el ultimo partido el backend modifica los fields
          if(matchResults.nextMatchId == null){
            this.fieldsResource.reload();
          }
        }
      })
  }

  handleTournamentFinish() {
    this.singleEliminationService.finishTournament(this.singleEliminationId()).subscribe({
      next: () => this.fieldsResource.reload()
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
