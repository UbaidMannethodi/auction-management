import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Team} from "../../../../model/team";
import {NgForOf, NgIf} from "@angular/common";
import {PlayerService} from "../../../../services/players/player.service";

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './team-overview.component.html',
  styleUrl: './team-overview.component.scss'
})
export class TeamOverviewComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {team: Team},
    private dialogRef: MatDialogRef<TeamOverviewComponent>,
    public playerService: PlayerService
  ) {
  }

}
