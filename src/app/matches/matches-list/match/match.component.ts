import { Component, input } from '@angular/core';
import { Match } from './match.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-match',
  imports: [DatePipe],
  templateUrl: './match.html',
  styleUrl: './match.css',
})
export class MatchComponent {
  match = input.required<Match>();
}
