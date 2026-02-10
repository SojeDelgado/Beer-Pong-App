// Angular
import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
// RxJS
import { rxResource } from '@angular/core/rxjs-interop';
// Matches
import { MatchesService } from '../matches.service';
import { MatchComponent } from "./match/match.component";
import { Match } from './match/match.model';
import { PaginationMeta } from '../../common/models/pagination-meta.interface';

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

  readonly matchesResource = rxResource({
    params: () => ({
      page: this.currentPage(),
      limit: this.limit(),
      dateFilter: this.dateFilter(),
      // Variable para recibir actualizaciones desde otro componente
      refresh: this.matchesService.refreshTrigger()
    }),
    stream: ({ params }) => this.matchesService.loadMatchesData(
      params.page, params.limit, params.dateFilter,
    ),
    defaultValue: {
      data: [], meta: { total: 0, page: 1, lastPage: 1 }
    }
  });

  readonly matches = computed(() => {
    if (!this.matchesResource.hasValue()) return [] as Match[]; // Si hay error, devuelve array vacío
    return this.matchesResource.value().data;
  });

  pagination = computed(() => {
    if (this.matchesResource.error()) return { total: 0, page: 1, lastPage: 1 } as PaginationMeta;
    return this.matchesResource.value().meta
  });
  // ToDo: Implement error message
  error = this.matchesResource.error;
  isLoading = this.matchesResource.isLoading;

  private errEff = effect(() => console.log("Error:", this.error() as HttpErrorResponse));

  isDropdownLimitOpen = signal(false);
  isDropdownOpen = signal(false);

  // Query parameters docs:
  // https://v20.angular.dev/guide/routing/read-route-state#query-parameters
  constructor() {
    this.route.queryParams.subscribe(params => {
      this.currentPage.set(Number(params['page']) || 1);
      this.limit.set(Number(params['limit']) || 10);
      this.dateFilter.set(params['dateFilter'] || 'Recientes');
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
      queryParamsHandling: 'merge'
    })
  }

  goToPage(page: number) {
    this.currentPage.update(() => page);
    this.router.navigate([], {
      queryParams: { page: this.currentPage() },
      queryParamsHandling: 'merge'
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
