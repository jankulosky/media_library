import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DialogInterface } from 'src/app/core/interfaces/DialogInterface';
import { MediaFile } from 'src/app/core/models/MediaFiles';
import { FileService } from 'src/app/core/services/file.service';
import { ConfirmDialogComponent } from '../../modals/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-file-edit',
  templateUrl: './file-edit.component.html',
  styleUrls: ['./file-edit.component.scss'],
})
export class FileEditComponent implements OnInit {
  fileForm!: FormGroup;
  file: MediaFile | undefined;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private fileService: FileService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<FileEditComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {
    this.setValidators();
    this.setFormValues();
  }

  setValidators(): void {
    this.fileForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      size: [''],
      createdAt: [''],
      lastModifiedAt: [''],
    });
  }

  setFormValues(): void {
    if (this.editData) {
      this.fileForm.controls['name'].setValue(this.editData.name);
      this.fileForm.controls['type'].setValue(this.editData.type);
      this.fileForm.controls['size'].setValue(this.editData.size);
      this.fileForm.controls['createdAt'].setValue(this.editData.createdAt);
      this.fileForm.controls['lastModifiedAt'].setValue(
        this.editData.lastModifiedAt
      );
    }
  }

  updateFile() {
    this.editData.name = this.fileForm.controls['name'].value;
    this.editData.lastModifiedAt = new Date();

    this.fileService.editFile(this.editData).subscribe({
      next: () => {
        this.fileForm.reset(this.file);
        this.dialogRef.close();
      },
      error: (err) => {
        this.errorMessage = err;
      },
    });
  }

  openConfirmEditDialog() {
    const dialogInterface: DialogInterface = {
      dialogHeader: 'Update file',
      dialogContent: 'Are you sure you want to update',
      fileName: this.editData.name,
      cancelButtonLabel: 'Cancel',
      confirmButtonLabel: 'Confirm',
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogInterface,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateFile();
      }
    });
  }
}
