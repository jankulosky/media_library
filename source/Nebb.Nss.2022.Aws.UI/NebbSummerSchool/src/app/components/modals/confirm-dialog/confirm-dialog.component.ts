import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogInterface } from 'src/app/core/interfaces/DialogInterface';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  result: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogInterface
  ) {}

  onDeclineClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.result = true;
    this.dialogRef.close(true);
  }
}
