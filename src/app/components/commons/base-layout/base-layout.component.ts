import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {Player} from "../../../model/player";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgClass,
    NgIf
  ],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss'
})
export class BaseLayoutComponent {

  sidebarOpen = false;

  constructor(private dialog: MatDialog, private router: Router) {
  }

  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Logout',
        message: `Are you sure you want to logout?`,
      },
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

}
