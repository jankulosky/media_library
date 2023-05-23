import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInterface } from 'src/app/core/interfaces/DialogInterface';
import { FileParams } from 'src/app/core/models/fileParams';
import { MediaFile } from 'src/app/core/models/MediaFiles';
import { FileService } from 'src/app/core/services/file.service';
import { FilePreviewComponent } from '../files/file-preview/file-preview.component';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';
import { Pagination } from 'src/app/core/models/pagination';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnInit {
  errorMessage = '';
  files: MediaFile[] = [];
  fileParams: FileParams = new FileParams();
  pagination: Pagination | undefined;
  selectedSortOption: string = 'newestFirst';
  selectedTypeOption: string = 'allFiles';
  searchOption: string = '';
  pageSizeOptions: string = '6';

  constructor(private fileService: FileService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getDeleted();
  }

  onSearchChange() {
    this.fileParams.searchBy = this.searchOption;
    this.getDeleted();
  }

  onSortSelectionChange() {
    switch (this.selectedSortOption) {
      case 'newestFirst':
        this.fileParams.orderBy = 'date';
        this.fileParams.sortOrder = 'desc';
        break;
      case 'oldestFirst':
        this.fileParams.orderBy = 'date';
        this.fileParams.sortOrder = 'asc';
        break;
      case 'nameAZ':
        this.fileParams.orderBy = 'name';
        this.fileParams.sortOrder = 'asc';
        break;
      case 'nameZA':
        this.fileParams.orderBy = 'name';
        this.fileParams.sortOrder = 'desc';
        break;
      default:
        break;
    }
    this.getDeleted();
  }

  onFilterSelectionChange() {
    this.fileParams.filterBy = this.selectedTypeOption;
    this.getDeleted();
  }

  getDeleted(): void {
    this.fileService.getDeletedFiles(this.fileParams).subscribe({
      next: (response) => {
        if (response.result && response.pagination) {
          this.files = response.result;
          this.pagination = response.pagination;
        }
      },
      error: (err) => {
        this.errorMessage = err;
      },
    });
  }

  openDialog(file: MediaFile): void {
    this.dialog.open(FilePreviewComponent, {
      data: file,
    });
  }

  findById(id: string): void {
    this.fileService
      .getArchivedFile(id, this.fileParams)
      .subscribe((file: MediaFile | undefined) => {
        if (file) {
          this.openDialog(file);
        } else {
          console.error(`File with id ${id} not found`);
        }
      });
  }

  restoreFile(file: any) {
    this.fileService.restoreFile(file, file.id).subscribe({
      next: () => {
        this.getDeleted();
      },
      error: (err) => {
        this.errorMessage = err;
      },
    });
  }

  hardDeleteFile(id: string): void {
    this.fileService.deleteFile(id).subscribe({
      next: () => {
        this.getDeleted();
      },
      error: (err) => {
        this.errorMessage = err;
      },
    });
  }

  openRestoreDialog(file: any) {
    const dialogInterface: DialogInterface = {
      dialogHeader: 'Restore file',
      dialogContent: 'Are you sure you want to restore',
      fileName: file.name,
      cancelButtonLabel: 'Cancel',
      confirmButtonLabel: 'Confirm',
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogInterface,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restoreFile(file);
      }
    });
  }

  openDeleteDialog(file: any) {
    const dialogInterface: DialogInterface = {
      dialogHeader: 'Delete file',
      dialogContent: 'Are you sure you want to delete',
      fileName: file.name,
      cancelButtonLabel: 'Cancel',
      confirmButtonLabel: 'Confirm',
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogInterface,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.hardDeleteFile(file.id);
      }
    });
  }

  pageChanged(event?: any) {
    if (event && event.page) {
      this.fileParams.pageNumber = event.page;
    }
    this.fileParams.pageSize = Number(this.pageSizeOptions);
    this.getDeleted();
  }
}
