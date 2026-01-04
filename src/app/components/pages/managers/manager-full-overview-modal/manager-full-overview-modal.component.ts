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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Team,
    private dialogRef: MatDialogRef<ManagerFullOverviewModalComponent>
  ) {
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
