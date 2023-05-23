import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileParams } from 'src/app/core/models/fileParams';
import { DialogInterface } from 'src/app/core/interfaces/DialogInterface';
import { MediaFile } from 'src/app/core/models/MediaFiles';
import { FileService } from 'src/app/core/services/file.service';
import { FileEditComponent } from '../../files/file-edit/file-edit.component';
import { FilePreviewComponent } from '../../files/file-preview/file-preview.component';
import { ConfirmDialogComponent } from '../../modals/confirm-dialog/confirm-dialog.component';
import { Pagination } from 'src/app/core/models/pagination';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.scss'],
})
export class UploadListComponent implements OnInit {
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
    this.getFiles();
  }

  onSearchChange() {
    this.fileParams.searchBy = this.searchOption;
    this.getFiles();
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
    this.getFiles();
  }

  onFilterSelectionChange() {
    this.fileParams.filterBy = this.selectedTypeOption;
    this.getFiles();
  }

  getFiles(): void {
    this.fileService.getFiles(this.fileParams).subscribe({
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
      .getFile(id, this.fileParams)
      .subscribe((file: MediaFile | undefined) => {
        if (file) {
          this.openDialog(file);
        } else {
          console.error(`File with id ${id} not found`);
        }
      });
  }

  editFile(file: any) {
    this.dialog.open(FileEditComponent, {
      width: '600px',
      data: file,
    });
  }

  archiveFile(file: any) {
    this.fileService.softDeleteFile(file, file.id).subscribe({
      next: () => {
        this.getFiles();
      },
      error: (err) => {
        this.errorMessage = err;
      },
    });
  }

  openArchiveDialog(file: any) {
    const dialogInterface: DialogInterface = {
      dialogHeader: 'Archive file',
      dialogContent: 'Are you sure you want to archive',
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
        this.archiveFile(file);
      }
    });
  }

  pageChanged(event?: any) {
    if (event && event.page) {
      this.fileParams.pageNumber = event.page;
    }
    this.fileParams.pageSize = Number(this.pageSizeOptions);
    this.getFiles();
  }
}
