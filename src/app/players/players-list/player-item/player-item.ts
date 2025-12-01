import { Component, inject, input } from '@angular/core';
import { PlayersService } from '../../players.service';
import { Player } from './player.model';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-player-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './player-item.html',
  styleUrl: './player-item.css',
})
export class PlayerItem {
  private playerService = inject(PlayersService);
  player = input.required<Player>();

  onDelete(playerId: string) {
    this.playerService.deletePlayer(playerId);
  }
}
