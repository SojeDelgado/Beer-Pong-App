// Angular
import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// RxJS
import { rxResource } from '@angular/core/rxjs-interop';
// Matches
import { MatchesService } from '../matches.service';
import { MatchComponent } from "./match/match.component";

@Component({
  selector: 'app-matches-list',
  imports: [MatchComponent],
  templateUrl: './matches-list.html',
  styleUrl: './matches-list.css',
})
export class MatchesList {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private matchesService = inject(MatchesService);

  currentPage = signal(1);
  limit = signal(10);
  dateFilter = signal('Recientes');

  // loader was renamed to stream in rxResource in v20 (rxResource).
  // also request was renamed to params:
  // link to resource: https://www.youtube.com/watch?v=_KyCmpMlVTc&list=LL&index=2

  readonly matchesResponse = rxResource({
    params: () => ({
      page: this.currentPage(),
      limit: this.limit(),
      dateFilter: this.dateFilter()
    }),
    stream: ({ params }) => this.matchesService.loadMatches(
      params.page, params.limit, params.dateFilter,
    ),
    defaultValue: {
      data: [], meta: {
        total: 0,
        page: 1,
        lastPage: 1
      }
    }
  });

  readonly matches = computed(() => this.matchesResponse.value().data);
  pagination = computed(() => this.matchesResponse.value().meta);

  isDropdownLimitOpen = signal(false);
  isDropdownOpen = signal(false);

  // Query parameters docs:
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
      this.currentPage.update(page => page - 1);
      this.router.navigate([], {
        queryParams: { page: this.currentPage() },
        queryParamsHandling: 'merge' // Preserve other query parameters
      })
    }
  }

  nextPage() {
    this.currentPage.update(page => page + 1);
    this.router.navigate([], {
      queryParams: { page: this.currentPage() },
      queryParamsHandling: 'merge' // Preserve other query parameters
    })
  }

  goToPage(page: number) {
    this.currentPage.update(() => page);
    this.router.navigate([], {
      queryParams: { page: this.currentPage() },
      queryParamsHandling: 'merge' // Preserve other query parameters
    })
  }

  changeLimit(limit: number) {
    this.limit.update(() => limit)
    this.router.navigate([], {
      queryParams: { page: 1, limit },
      queryParamsHandling: 'merge'
    });
  }

  filter(dateFilter: string) {
    this.dateFilter.update(() => dateFilter);
    this.router.navigate([], {
      queryParams: { dateFilter },
      queryParamsHandling: 'merge'
    });
  }

  toggleDropdown(dropdown: WritableSignal<boolean>) {
    dropdown.update(v => !v);
  }
}
