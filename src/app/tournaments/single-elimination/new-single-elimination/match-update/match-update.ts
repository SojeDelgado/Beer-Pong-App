import { AfterViewInit, Component, ElementRef, inject, input, output, viewChild, effect } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SingleEliminationMatch } from '../../../../matches/matches-list/match/match.model';
import { SingleEliminationService } from '../../single-elimination.service';

@Component({
  selector: 'app-match-update',
  standalone: true, // Asegúrate de que sea standalone si usas imports directos
  imports: [ReactiveFormsModule], // Quité el internalModule, con ReactiveFormsModule suele bastar
  templateUrl: './match-update.html',
  styleUrl: './match-update.css',
})
export class MatchUpdate implements AfterViewInit {
  tournamentId = input.required<string>();
  match = input.required<SingleEliminationMatch>();
  close = output<void>();

  private singleEliminationService = inject(SingleEliminationService);
  private dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  singleEliminationMatchForm = new FormGroup({
    homeScore: new FormControl(0, { validators: [Validators.required, Validators.min(0), Validators.max(10)], nonNullable: true }),
    awayScore: new FormControl(0, { validators: [Validators.required, Validators.min(0), Validators.max(10)], nonNullable: true }),
    homeIsla: new FormControl(false, { nonNullable: true }),
    awayIsla: new FormControl(false, { nonNullable: true }),
    home2in1: new FormControl(false, { nonNullable: true }),
    away2in1: new FormControl(false, { nonNullable: true }),
    home3in1: new FormControl(false, { nonNullable: true }),
    away3in1: new FormControl(false, { nonNullable: true })
  });

  constructor() {
    /**
     * Sincroniza el Input con el Formulario.
     * Al ser un effect, se ejecuta automáticamente cuando `match()` cambia.
     */
    effect(() => {
      const m = this.match();
      this.singleEliminationMatchForm.patchValue({
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        homeIsla: m.homeIsla,
        awayIsla: m.awayIsla,
        home2in1: m.home2in1,
        away2in1: m.away2in1,
        home3in1: m.home3in1,
        away3in1: m.away3in1
      });
    });
  }

  ngAfterViewInit(): void {
    const dialog = this.dialogEl().nativeElement;
    dialog.showModal();

    dialog.addEventListener('close', () => this.close.emit());

    // Cerrar al hacer click fuera (en el backdrop)
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) this.handleClose();
    });
  }

  handleClose() {
    this.dialogEl().nativeElement.close();
  }

  onSubmit() {
    if (this.singleEliminationMatchForm.invalid) return;

    // Usamos getRawValue() porque definimos los controles como nonNullable
    const formValues = this.singleEliminationMatchForm.getRawValue();

    this.singleEliminationService.updateTournamentMatch({
      ...formValues,
      tournamentId: this.tournamentId(),
      home: this.match().home.id,
      away: this.match().away.id,
      matchId: this.match().matchId,
      nextMatchId: this.match().nextMatchId,
    }).subscribe({
      next: () => {
        // Notificamos al servicio para que el componente Bracket refresque sus datos
        this.singleEliminationService.notifyUpdate();
        this.handleClose();
      },
      error: (err) => console.error('Error actualizando match:', err)
    });
  }
}