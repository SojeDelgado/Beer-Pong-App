import { Component, input } from '@angular/core';
import { TournamentData } from '../../../round-robin/tournament-data.model';
import { DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from "@angular/router";


@Component({
  selector: 'app-single-elimination-item',
  imports: [DatePipe, RouterLink],
  templateUrl: './single-elimination-item.html',
  styleUrl: './single-elimination-item.css',
})
export class SingleEliminationItem {
  singleElimination = input.required<TournamentData>();
}
