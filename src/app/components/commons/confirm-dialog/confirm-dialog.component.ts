// confirm-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-xl font-semibold text-gray-800" [innerHTML]="data.title"></h2>
      <p class="mt-2 text-gray-600" [innerHTML]="data.message "></p>

      <div class="mt-6 flex justify-end space-x-4">
        <button
          class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
          (click)="onCancel()">Cancel</button>
        <button
          class="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
          (click)="onConfirm()">Confirm</button>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string },
    private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
