import { Component, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Header } from "./header/header";
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-project');

  isSidebarOpen: boolean = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggle() {
    document.body.classList.toggle("light");
  }
}
