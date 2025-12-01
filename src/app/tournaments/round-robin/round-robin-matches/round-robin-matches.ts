import { Component, input} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-round-robin-matches',
  imports: [RouterOutlet],
  templateUrl: './round-robin-matches.html',
  styleUrl: './round-robin-matches.css',
})
export class RoundRobinMatches {
  roundRobinId = input.required<string>();
}
