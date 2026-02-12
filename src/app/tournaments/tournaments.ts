import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router } from "@angular/router";

@Component({
  selector: 'app-tournaments',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './tournaments.html',
  styleUrl: './tournaments.css',
})
export class Tournaments {
  router = inject(Router);

  goToNew() {
    this.router.navigate([this.router.url, 'new']);
  }

}
