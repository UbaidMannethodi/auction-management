import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {NgForOf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {PlayerFormComponent} from "../players/player-form/player-form.component";
import {ManagerFormComponent} from "./manager-form/manager-form.component";

@Component({
  selector: 'app-managers',
  standalone: true,
  imports: [
    MatButton,
    NgForOf
  ],
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.scss'
})
export class ManagersComponent {


  data = [
    {
      imageUrl: 'https://via.placeholder.com/100',
      name: 'John Doe',
    },
    {
      imageUrl: 'https://via.placeholder.com/100',
      name: 'Jane Smith',
    },
  ];

  constructor(private dialog: MatDialog) {}

  openAddPlayerDialog(): void {
    const dialogRef = this.dialog.open(ManagerFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.push(result);
      }
    });
  }

}
