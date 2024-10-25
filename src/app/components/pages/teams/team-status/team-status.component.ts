import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-team-status',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './team-status.component.html',
  styleUrl: './team-status.component.scss'
})
export class TeamStatusComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  consolidatePositions(positions: string[]): string {
    const counts = positions.reduce((acc: any, pos) => {
      acc[pos] = (acc[pos] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([pos, count]) => `${pos} (${count})`)
      .join(', ');
  }
}
