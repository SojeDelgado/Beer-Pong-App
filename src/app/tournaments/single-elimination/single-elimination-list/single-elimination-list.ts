import { Component, inject, signal, WritableSignal } from '@angular/core';
import { SingleEliminationService } from '../single-elimination.service';
import { SingleEliminationItem } from "./single-elimination-item/single-elimination-item";
import { ActivatedRoute, Router, RouterLinkActive, RouterLinkWithHref } from "@angular/router";

@Component({
  selector: 'app-single-elimination-list',
  imports: [SingleEliminationItem, RouterLinkActive, RouterLinkWithHref],
  templateUrl: './single-elimination-list.html',
  styleUrl: './single-elimination-list.css',
})
export class SingleEliminationList {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  seService = inject(SingleEliminationService);
  singleEliminations = this.seService.singleEliminations;
  pagination = this.seService.pagination;

  currentPage = signal(0);
  limit = signal(10);
  dateFilter = signal('Reciente');

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
      this.seService.loadTournaments(page, limit, dateFilter);
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
