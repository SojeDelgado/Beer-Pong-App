import { Component } from '@angular/core';
import { MatchesList } from "./matches-list/matches-list";

@Component({
  selector: 'app-matches',
  imports: [MatchesList],
  templateUrl: './matches.html',
  styleUrl: './matches.css',
})
export class Matches {

}
