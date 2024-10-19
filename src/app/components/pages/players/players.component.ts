import { Component } from '@angular/core';
import {CurrencyPipe, NgForOf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {PlayerFormComponent} from "./player-form/player-form.component";

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf,
    MatButton
  ],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss'
})
export class PlayersComponent {

  data = [
    {
      tokenNo: 'A123',
      imageUrl: 'https://via.placeholder.com/100',
      name: 'John Doe',
      position: 'Forward',
      price: 50,
      team: 'Team A',
    },
    {
      tokenNo: 'B456',
      imageUrl: 'https://via.placeholder.com/100',
      name: 'Jane Smith',
      position: 'Midfielder',
      price: 60,
      team: 'Team B',
    },
    {
      tokenNo: 'B456',
      imageUrl: 'https://via.placeholder.com/100',
      name: 'Jane Smith',
      position: 'Midfielder',
      price: 60,
      team: 'Team B',
    },
    {
      tokenNo: 'B4352356',
      imageUrl: 'https://via.placeholder.com/100',
      name: 'Jane Smith',
      position: 'Midfielder',
      price: 60,
      team: 'Team B',
    },
    {
      tokenNo: '5235',
      imageUrl: 'https://via.placeholder.com/100',
      name: 'Jane Smith',
      position: 'Midfielder',
      price: 60,
      team: 'Team B',
    },
  ];

  constructor(private dialog: MatDialog) {}

  openAddPlayerDialog(): void {
    const dialogRef = this.dialog.open(PlayerFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.push(result);
      }
    });
  }


}
