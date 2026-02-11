// Angular
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NgClass } from '@angular/common';
// Service
import { ErrorService } from './shared/error.service';
// Components
import { Header } from "./header/header";
import { ErrorModalComponent } from "./shared/modal/error-modal/error-modal.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, NgClass, ErrorModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Handle errors and send a modal
  private errorService = inject(ErrorService)
  error = this.errorService.error;

  protected readonly title = signal('angular-project');

  isSidebarOpen: boolean = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggle() {
    document.body.classList.toggle("light");
  }
}
