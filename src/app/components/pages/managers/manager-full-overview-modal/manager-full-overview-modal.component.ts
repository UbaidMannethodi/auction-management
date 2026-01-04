import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Team} from "../../../../model/team";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-manager-full-overview-modal',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './manager-full-overview-modal.component.html',
  styleUrl: './manager-full-overview-modal.component.scss'
})
export class ManagerFullOverviewModalComponent {

  isImageLoading  = true;
  currentTeamIndex = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {team: Team, fullTeams: Team[]},
    private dialogRef: MatDialogRef<ManagerFullOverviewModalComponent>
  ) {
  }


  showNextTeam(event: MouseEvent) {
    event.stopPropagation(); // prevents overlay close
    if (!this.data?.fullTeams?.length) return;

    this.isImageLoading = true;

    this.currentTeamIndex =
      (this.currentTeamIndex + 1) % this.data.fullTeams.length;

    this.data.team = this.data.fullTeams[this.currentTeamIndex];
  }

  close(): void {
    this.dialogRef.close();
  }

  onImageLoad() {
    this.isImageLoading = false;
  }

  onImageError() {
    this.isImageLoading = false;
  }

}
