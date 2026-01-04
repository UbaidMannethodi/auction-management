import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {CurrencyPipe, NgClass, NgForOf, NgIf, NgStyle, TitleCasePipe} from "@angular/common";
import {Team, TeamStatus} from "../../../../model/team";
import {Player} from "../../../../model/player";
import {TeamService} from "../../../../services/team/team.service";

@Component({
  selector: 'app-team-status',
  standalone: true,
  imports: [
    NgForOf,
    TitleCasePipe,
    CurrencyPipe,
    NgIf,
    NgClass,
    NgStyle
  ],
  templateUrl: './team-status.component.html',
  styleUrl: './team-status.component.scss'
})
export class TeamStatusComponent {

  objectKeys = Object.keys;
  playersCount: number = 0;
  teamStatus: any;
  currentTeamIndex = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {team: Team, fullTeams: Team[]},
              private teamService: TeamService) {
    if (this.data?.fullTeams?.length) {
      this.currentTeamIndex = this.data.fullTeams.findIndex(
        t => t.id === this.data.team?.id
      );
      if (this.currentTeamIndex === -1) {
        this.currentTeamIndex = 0;
      }
    }

    if (this.data?.team?.players?.length) {
      this.getPlayerCount(this.data.team.players);
    }

    if (this.data.team) {
      this.getTeamStatus(this.data.team);
    }
  }

  getTeamStatus(team: Team) {
    this.teamStatus = this.teamService.getTeamStatus(team);
  }

  showNextTeam(event: MouseEvent): void {
    event.stopPropagation();

    if (!this.data?.fullTeams?.length) return;

    this.currentTeamIndex =
      (this.currentTeamIndex + 1) % this.data.fullTeams.length;

    const nextTeam = this.data.fullTeams[this.currentTeamIndex];

    this.data.team = nextTeam;
    this.getTeamStatus(nextTeam);
    this.getPlayerCount(nextTeam.players || []);
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
