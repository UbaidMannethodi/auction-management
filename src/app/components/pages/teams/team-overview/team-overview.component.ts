import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Team} from "../../../../model/team";
import {CurrencyPipe, NgForOf, NgIf, NgStyle, SlicePipe, TitleCasePipe} from "@angular/common";
import {TeamStatusComponent} from "../team-status/team-status.component";
import {TeamService} from "../../../../services/team/team.service";

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgStyle,
    TitleCasePipe,
    CurrencyPipe,
    SlicePipe,
  ],
  templateUrl: './team-overview.component.html',
  styleUrl: './team-overview.component.scss'
})
export class TeamOverviewComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {team: Team},
    private teamService: TeamService,
    private dialogRef: MatDialog) {}

  openTeamStatusDialog(): void {
    this.dialogRef.open(TeamStatusComponent, {
      minWidth: '70vw',
      minHeight: '85vh',
      data: {
        teamStatus: this.teamService.getTeamStatus(this.data?.team),
        team: this.data?.team
      }
    });
  }

}
