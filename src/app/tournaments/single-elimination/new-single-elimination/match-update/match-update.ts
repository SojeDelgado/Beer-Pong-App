import { AfterViewInit, Component, computed, ElementRef, EventEmitter, inject, input, output, signal, viewChild, ViewChild } from '@angular/core';
import { SingleEliminationMatch } from '../../../../matches/matches-list/match/match.model';
import { FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { SingleEliminationService } from '../../single-elimination.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-match-update',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './match-update.html',
  styleUrl: './match-update.css',
})
export class MatchUpdate implements AfterViewInit {
  tournamentId = input.required<string>();
  singleEliminationService = inject(SingleEliminationService);
  match = input.required<SingleEliminationMatch>();
  private matchSub?: Subscription;

  private dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialog')
  close = output<void>();

  ngAfterViewInit(): void {

    this.dialogEl().nativeElement.showModal();
    this.dialogEl().nativeElement.addEventListener('close', () => {
      this.close.emit();
    });

    // presionar en el backdrop se cierra el componente.
    this.dialogEl().nativeElement.addEventListener('click', (event) => {
      if (event.target === this.dialogEl().nativeElement) {
        this.handleClose();
      }
    });
  }

  ngOnDestroy() {
    this.matchSub?.unsubscribe();
  }

  handleClose() {
    this.dialogEl().nativeElement.close();
  }


  singleEliminationMatchForm = new FormGroup({
    homeScore: new FormControl(0, { validators: [Validators.required, Validators.min(0), Validators.max(10)] }),
    awayScore: new FormControl(0, { validators: [Validators.required, Validators.min(0), Validators.max(10)] }),

    homeIsla: new FormControl<boolean>(false),
    awayIsla: new FormControl<boolean>(false),
    home2in1: new FormControl<boolean>(false),
    away2in1: new FormControl<boolean>(false),
    home3in1: new FormControl<boolean>(false),
    away3in1: new FormControl<boolean>(false)
  })

  onSubmit() {
    if (this.singleEliminationMatchForm.valid) {
      const { homeScore, awayScore, homeIsla, awayIsla, home2in1, away2in1, home3in1, away3in1 } = this.singleEliminationMatchForm.value;

      console.log("Enviando datos",
        "tournamentId", this.tournamentId(),
        "IDs:", this.match().home.id, this.match().away.id
      );

      this.singleEliminationService.updateTournamentMatch({
        tournamentId: this.tournamentId(),
        id: this.match().id,
        home: this.match().home.id,
        away: this.match().away.id,
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        homeIsla: homeIsla ?? false,
        awayIsla: awayIsla ?? false,
        home2in1: home2in1 ?? false,
        away2in1: away2in1 ?? false,
        home3in1: home3in1 ?? false,
        away3in1: away3in1 ?? false,
        matchId: this.match().matchId,
        nextMatchId: this.match().nextMatchId,
      }).subscribe({
        next: (response) => {
          console.log('¡Éxito!', response);
          this.handleClose();
        },
        error: (err) => {
          console.error('Error al enviar', err);
        }
      });

      this.handleClose();
    }
  }

}
