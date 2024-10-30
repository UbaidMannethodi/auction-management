import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Team} from "../../../../model/team";
import {CurrencyPipe, NgForOf, NgIf, NgStyle, TitleCasePipe} from "@angular/common";
import {PlayerService} from "../../../../services/players/player.service";
import {Player} from "../../../../model/player";

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgStyle,
    TitleCasePipe,
    CurrencyPipe
  ],
  templateUrl: './team-overview.component.html',
  styleUrl: './team-overview.component.scss'
})
export class TeamOverviewComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {team: Team},
    private dialogRef: MatDialogRef<TeamOverviewComponent>,
    public playerService: PlayerService
  ) {}

  getPlayersWithPlaceholders(players: Player[]): any[] {
    const defaultPlayers = Array.from({ length: 7 - players.length }, (_, i) => ({
      image: '/images/icons/avatar.png',
      name: `Player ${players.length + i + 1}`,
      position: ''
    }));

    return [...players, ...defaultPlayers];
  }

}
