import { Component, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TournamentData } from '../../tournament-data.model';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-round-robin-item',
  imports: [DatePipe, RouterLink, RouterLinkActive],
  templateUrl: './round-robin-item.html',
  styleUrl: './round-robin-item.css',
})
export class RoundRobinItem {
  roundRobin = input.required<TournamentData>();
}
