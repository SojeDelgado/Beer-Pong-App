import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-matches',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './matches.html',
  styleUrl: './matches.css',
})
export class MatchesComponent{
  router = inject(Router);
  
  goToNew() {
    this.router.navigate([this.router.url, 'new']);
  }
}
