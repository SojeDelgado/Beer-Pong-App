import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { MatchesService } from '../matches.service';
import { MatchComponent } from "./match/match.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-matches-list',
  imports: [MatchComponent],
  templateUrl: './matches-list.html',
  styleUrl: './matches-list.css',
})
export class MatchesList {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  matchesService = inject(MatchesService);
  matches = this.matchesService.matches;
  pagination = this.matchesService.pagination;

  currentPage = signal(0);
  limit = signal(10);

  isDropdownOpen = signal(false);

  // Puedo ver la documentacion en:
  // https://v20.angular.dev/guide/routing/read-route-state#query-parameters

  constructor() {
    this.route.queryParams.subscribe(params => {
      const page = Number(params['page']) || 1;
      const limit = Number(params['limit']) || 10;
      this.currentPage.set(page);
      this.limit.set(limit)
      this.matchesService.loadMatches(page, limit);
    });
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.router.navigate([], {
        queryParams: { page: this.currentPage() - 1 },
        queryParamsHandling: 'merge' // Preserve other query parameters
      })
    }
  }

  nextPage() {
    this.router.navigate([], {
      queryParams: { page: this.currentPage() + 1 },
      queryParamsHandling: 'merge' // Preserve other query parameters
    })
  }

  goToPage(page: number) {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }

  changeLimit(limit: number) {
    this.router.navigate([], {
      queryParams: { page: 1, limit },
      queryParamsHandling: 'merge'
    });
  }

  toggleDropdown() {
    this.isDropdownOpen.update(v => !v);
  }
}
