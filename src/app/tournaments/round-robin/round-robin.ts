import { Component, signal } from '@angular/core';
import { Pairings } from '../pairings.model';
import { RoundRobinList } from "./round-robin-list/round-robin-list";
import { RouterOutlet } from '@angular/router';
import { SelectPlayers } from "../select-players/select-players";
import { RoundRobinForm } from "./round-robin-form/round-robin-form";
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-round-robin',
  imports: [RoundRobinList, RouterOutlet, SelectPlayers, RoundRobinForm, NgClass],
  templateUrl: './round-robin.html',
  styleUrl: './round-robin.css',
})
export class RoundRobinComponent {
  players = signal<{ id: string; nickname: string }[]>([]);
  pairings: Pairings[] = [];
  isAddingMatch = false

  onSelectedPlayers(players: { id: string; nickname: string }[]) {
    this.players.set(players);
    this.pairings = this.generatePairings(players);
  }

  isEven(number: number) {
    return number % 2 === 0;
  }

  generatePairings(players: { id: string; nickname: string }[]): Pairings[] {
    const n = players.length;
    const pairings: Pairings[] = [];

    // Bye para saber que paso a la siguiente ronda.
    const list = [...players];
    if (!this.isEven(n)) {
      list.push({ id: "BYE", nickname: "BYE" });
    }

    const totalPlayers = list.length;
    const arr = [...list];

    for (let round = 0; round < totalPlayers - 1; round++) {
      for (let i = 0; i < totalPlayers / 2; i++) {
        const home = arr[i];
        const away = arr[totalPlayers - 1 - i];

        if (home.id === "BYE" || away.id === "BYE") { continue; }

        pairings.push({
          playerId1: home.id,
          playerId2: away.id,
          player1Nickname: home.nickname,
          player2Nickname: away.nickname
        })
      }
      // Rotación del algoritmo de round robin
      const rest = arr.slice(1);
      rest.unshift(rest.pop()!);
      arr.splice(1, rest.length, ...rest);
    }
    return pairings
  }

  onStartAddMatchWindow() {
    this.isAddingMatch = true
  }

  onCloseAddMatchWindow() {
    this.isAddingMatch = false
  }
}
