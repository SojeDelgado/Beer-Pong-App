import { Component, inject, signal, WritableSignal } from '@angular/core';
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
  dateFilter = signal('Reciente');

  isDropdownLimitOpen = signal(false);
  isDropdownOpen = signal(false);

  // Puedo ver la documentacion en:
  // https://v20.angular.dev/guide/routing/read-route-state#query-parameters

  constructor() {
    this.route.queryParams.subscribe(params => {
      const page = Number(params['page']) || 1;
      const limit = Number(params['limit']) || 10;
      const dateFilter = params['dateFilter'] || 'Recientes';
      this.currentPage.set(page);
      this.limit.set(limit)
      this.dateFilter.set(dateFilter);
      this.matchesService.loadMatches(page, limit, dateFilter);
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

  filter(dateFilter: string) {
    this.router.navigate([], {
      queryParams: { dateFilter },
      queryParamsHandling: 'merge'
    });
  }

  toggleDropdown(dropdown: WritableSignal<boolean>) {
    dropdown.update(v => !v);
  }
}
