import {Component, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {NgForOf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {Manager} from "../../../model/manager";
import {ToastrService} from "ngx-toastr";
import {ConfirmDialogComponent} from "../../commons/confirm-dialog/confirm-dialog.component";
import {ManagersService} from "../../../services/managers/managers.service";
import {ManagerFormComponent} from "./manager-form/manager-form.component";
import {NgxLoadingModule} from "ngx-loading";

@Component({
  selector: 'app-managers',
  standalone: true,
  imports: [
    MatButton,
    NgForOf,
    NgxLoadingModule
  ],
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.scss'
})
export class ManagersComponent implements OnInit {

  managers: Manager[] = [];
  loading = false;

  constructor(private dialog: MatDialog,
              private managerService: ManagersService,
              private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getManagers();
  }


  async getManagers() {
    try {
      this.loading = true;
      this.managers = await this.managerService.getManagers();
    } catch (error: any) {
      this.loading = false;
      this.toastr.error(error, 'Something went wrong.');
    } finally {
      this.loading = false;
    }
  }

  editManager(manager: Manager): void {
    this.openAdManagerDialog(manager);
  }

  openConfirmDialog(manager: Manager): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete <b>${manager.name}</b>?`,
      },
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteManager(manager);
      }
    });
  }

  async deleteManager(manager: Manager) {
    try {
      this.loading = true;
      await this.managerService.deleteManager(manager?.id);
    } catch (error: any) {
      this.loading = false;
      this.toastr.error(error, 'Something went wrong.');
    } finally {
      this.managers = this.managers.filter(p => p.id !== manager.id);
      this.loading = false;
    }
  }

  openAdManagerDialog(manager?: Manager): void {
    const editMode = !!manager
    const dialogRef = this.dialog.open(ManagerFormComponent, {
      width: '400px',
      data: {editMode, manager,}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.type === 'success') {
        this.getManagers();
      }
    });
  }

}
