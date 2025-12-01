import { Component, computed, inject } from '@angular/core';
import { PlayersService } from '../players.service';
import { PlayerItem } from "./player-item/player-item";
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-players-list',
  imports: [PlayerItem],
  templateUrl: './players-list.html',
  styleUrl: './players-list.css',
})
export class PlayersList {
  playersService = inject(PlayersService);
  players = toSignal(this.playersService.players$);
}
