import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { MatchUp } from '../matchup.model';
import { RoundRobinService } from './round-robin.service';


@Component({
  selector: 'app-round-robin',
  imports: [RouterOutlet, RouterLinkWithHref],
  templateUrl: './round-robin.html',
  styleUrl: './round-robin.css',
})
export class RoundRobinComponent {
}
