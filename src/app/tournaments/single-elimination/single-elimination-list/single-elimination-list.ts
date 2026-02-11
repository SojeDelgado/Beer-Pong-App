import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { SingleEliminationService } from '../single-elimination.service';
import { SingleEliminationItem } from "./single-elimination-item/single-elimination-item";
import { ActivatedRoute, Router, RouterLinkActive, RouterLinkWithHref } from "@angular/router";
import { rxResource } from '@angular/core/rxjs-interop';
import { TournamentData } from '../../../common/models/single-elimination-data.model';
import { PaginationMeta } from '../../../common/models/pagination-meta.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { setErrorMessage } from '../../../error-message';

@Component({
  selector: 'app-single-elimination-list',
  imports: [SingleEliminationItem, RouterLinkActive, RouterLinkWithHref],
  templateUrl: './single-elimination-list.html',
  styleUrl: './single-elimination-list.css',
})
export class SingleEliminationList {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seService = inject(SingleEliminationService);

  currentPage = signal(1);
  limit = signal(10);
  dateFilter = signal('Recientes');

  readonly seResource = rxResource({
    params: () => ({
      page: this.currentPage(),
      limit: this.limit(),
      dateFilter: this.dateFilter(),
      // Variable para recibir actualizaciones desde otro componente
      refresh: this.seService.refreshTrigger()
    }),
    stream: ({ params }) => this.seService.loadTournamentsData(
      params.page, params.limit, params.dateFilter,
    )
  })

  readonly singleEliminations = computed(() => {
    if (!this.seResource.hasValue) return [] as TournamentData[]
    return this.seResource.value()!.data
  });

  // Manejo de esta manera la paginacion para que se sigan mostrando las opciones de filtrado aunque haya errores
  // Y no rompa con la estetica del programa.
  pagination = computed(() => {
    if (this.seResource.error() || !this.seResource.hasValue()) {
      return { total: 0, page: 1, lastPage: 1 } as PaginationMeta;
    }
    return this.seResource.value().meta;
  });

  isLoading = this.seResource.isLoading;
  error = computed(() => this.seResource.error() as HttpErrorResponse);
  errorMessage = computed(() => setErrorMessage(this.error(), 'partidos'));


  isDropdownLimitOpen = signal(false);
  isDropdownOpen = signal(false);


  constructor() {
    this.route.queryParams.subscribe(params => {
      const page = Number(params['page']) || 1;
      const limit = Number(params['limit']) || 10;
      const dateFilter = params['dateFilter'] || 'Recientes';
      this.currentPage.set(page);
      this.limit.set(limit)
      this.dateFilter.set(dateFilter);
      this.seService.loadTournamentsData(page, limit, dateFilter);
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
