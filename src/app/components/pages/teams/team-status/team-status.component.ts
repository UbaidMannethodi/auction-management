import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {CurrencyPipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {Team, TeamStatus} from "../../../../model/team";
import {Player} from "../../../../model/player";

@Component({
  selector: 'app-team-status',
  standalone: true,
  imports: [
    NgForOf,
    TitleCasePipe,
    CurrencyPipe,
    NgIf
  ],
  templateUrl: './team-status.component.html',
  styleUrl: './team-status.component.scss'
})
export class TeamStatusComponent {

  objectKeys = Object.keys;
  playersCount: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {teamStatus: TeamStatus, team: Team}) {
    if (this.data?.team?.players?.length) {
      this.getPlayerCount(this.data?.team?.players)
    }
  }


  getPlayerCount(players: Player[]): void {
    const playerCont = []
    for (const player of players) {
      if (player?.id) {
        playerCont.push(player);
      }
    }
    this.playersCount = playerCont?.length;
  }


}
