import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {PlayerFormComponent} from "./player-form/player-form.component";
import {PlayerService} from "../../../services/player.service";
import {Player} from "../../../model/player";

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
export class PlayersComponent implements OnInit {

  players: Player[] = [];

  constructor(private dialog: MatDialog, private playerService: PlayerService) {}

  ngOnInit() {
    this.getPlayers()
  }


  async getPlayers() {
    this.players = await this.playerService.getPlayers();
  }

  editPlayer(player: Player): void {
    this.openAddPlayerDialog(player);
  }

  openAddPlayerDialog(player?:Player): void {
    const editMode = !!player
    const dialogRef = this.dialog.open(PlayerFormComponent, {
      width: '400px',
      data: {editMode, player}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.type === 'success') {
        this.getPlayers();
      }
    });
  }


}
