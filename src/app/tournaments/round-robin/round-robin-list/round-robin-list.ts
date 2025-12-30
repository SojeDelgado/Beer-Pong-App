import { Component, computed, inject, signal } from '@angular/core';
import { RoundRobinService } from '../round-robin.service';
import { RoundRobinItem } from "./round-robin-item/round-robin-item";

@Component({
  selector: 'app-round-robin-list',
  imports: [RoundRobinItem],
  templateUrl: './round-robin-list.html',
  styleUrl: './round-robin-list.css',
})
export class RoundRobinList {
  rrService = inject(RoundRobinService);
  roundRobins =  computed(() => this.rrService.roundRobins());
}
