import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {CurrencyPipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {Team, TeamStatus} from "../../../../model/team";

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: {teamStatus: TeamStatus, team: Team}) {}


}
