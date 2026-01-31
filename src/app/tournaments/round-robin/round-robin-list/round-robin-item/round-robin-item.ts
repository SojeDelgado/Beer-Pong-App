import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { TournamentData } from '../../../../common/models/single-elimination-data.model';

@Component({
  selector: 'app-round-robin-item',
  imports: [DatePipe, RouterLink],
  templateUrl: './round-robin-item.html',
  styleUrl: './round-robin-item.css',
})
export class RoundRobinItem {
  roundRobin = input.required<TournamentData>();
}
