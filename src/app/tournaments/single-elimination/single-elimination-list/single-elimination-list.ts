import { Component, computed, inject } from '@angular/core';
import { SingleEliminationService } from '../single-elimination.service';
import { SingleEliminationItem } from "./single-elimination-item/single-elimination-item";
import { RouterLinkActive, RouterLinkWithHref } from "@angular/router";

@Component({
  selector: 'app-single-elimination-list',
  imports: [SingleEliminationItem, RouterLinkActive, RouterLinkWithHref],
  templateUrl: './single-elimination-list.html',
  styleUrl: './single-elimination-list.css',
})
export class SingleEliminationList {
  seService = inject(SingleEliminationService);
  singleEliminations = computed(() => this.seService.singleEliminations())

}
