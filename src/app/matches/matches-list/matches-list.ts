import { Component, inject } from '@angular/core';
import { MatchesService } from '../matches.service';
import { MatchComponent } from "./match/match.component";

@Component({
  selector: 'app-matches-list',
  imports: [MatchComponent],
  templateUrl: './matches-list.html',
  styleUrl: './matches-list.css',
})
export class MatchesList {
  matchesService = inject(MatchesService);
  matches = this.matchesService.matches;
  isAddingMatch = false

  onStartAddMatchWindow() {
    this.isAddingMatch=true
  }

  onCloseAddMatchWindow() {
    this.isAddingMatch=false
  }

}
