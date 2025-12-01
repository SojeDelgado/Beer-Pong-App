import { Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-player-stats',
  imports: [RouterOutlet],
  templateUrl: './player-stats.html',
  styleUrl: './player-stats.css',
})
export class PlayerStats {
  // este input extrae el parametro playerId de la ruta con el input
  // en app.config en provideRouter colocamos: withComponentInputBinding() para habilitar la
  // extraccion de parametros mediante la ruta. Tienen que llamarse igual en la ruta y en el input.
  playerId = input.required<string>();
 
}
