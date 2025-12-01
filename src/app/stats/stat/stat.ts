import { Component, input } from '@angular/core';
import { Stat } from './stat.model';

@Component({
  selector: 'app-stat',
  imports: [],
  templateUrl: './stat.html',
  styleUrl: './stat.css',
})
export class StatComponent {
  stat = input.required<Stat>();

}
