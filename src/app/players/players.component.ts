import { Component, inject } from '@angular/core';
import { PlayersService } from './players.service';
import { PlayersList } from "./players-list/players-list";
import { RouterOutlet, RouterLinkWithHref } from "@angular/router"

@Component({
  selector: 'app-players',
  imports: [PlayersList, RouterOutlet, RouterLinkWithHref],
  templateUrl: './players.html',
  styleUrl: './players.css',
})
export class PlayersComponent {
  playersService = inject(PlayersService);
}
