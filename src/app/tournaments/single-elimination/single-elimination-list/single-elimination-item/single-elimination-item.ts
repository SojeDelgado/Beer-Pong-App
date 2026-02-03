import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { TournamentData } from '../../../../common/models/single-elimination-data.model';


@Component({
  selector: 'app-single-elimination-item',
  imports: [DatePipe, RouterLink],
  templateUrl: './single-elimination-item.html',
  styleUrl: './single-elimination-item.css',
})
export class SingleEliminationItem {
  singleElimination = input.required<TournamentData>();
}
