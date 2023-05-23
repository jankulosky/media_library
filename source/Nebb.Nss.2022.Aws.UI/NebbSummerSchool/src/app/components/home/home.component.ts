import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MediaFile } from 'src/app/core/models/MediaFiles';
import { FileService } from 'src/app/core/services/file.service';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FileEditComponent } from '../files/file-edit/file-edit.component';
import { DialogInterface } from 'src/app/core/interfaces/DialogInterface';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { FileParams } from 'src/app/core/models/fileParams';
import { Pagination } from 'src/app/core/models/pagination';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'type',
    'size',
    'createdAt',
    'lastModifiedAt',
    'action',
  ];

  progress = 0;
  files: any[] = [];
  message!: string;
  errorMessage: string = '';
  dataSource!: MatTableDataSource<MediaFile>;
  fileParams: FileParams = new FileParams();
  pagination!: Pagination;
  showFirstLastButtons = true;
  pageEvent: PageEvent | undefined;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  @Output() public onUploadFinished = new EventEmitter();

  constructor(private fileService: FileService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getFiles();
  }

  onFileDropped($event: any) {
    this.prepareFilesList($event);
    this.uploadFile($event);
  }

  fileBrowseHandler(files: any) {
    if (files && files.length) {
      this.prepareFilesList(files);
    }
  }

  removeFileFromList(index: number) {
    if (this.files[index].progress < 100) {
      console.log('Upload in progress.');
      return;
    }
    this.files.splice(index, 1);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      item.uploadStatus = '';
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  uploadFile(files: any) {
    if (files.length === 0) {
      return;
    }
    this.fileService.postFile(files).subscribe({
      next: (event: any) => {
        const index = this.files.findIndex((f) => f.name === files[0].name);
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            const total: number = event.total;
            this.files[index].progress = Math.round(
              (100 * event.loaded) / total
            );
          }
        } else if (event.type === HttpEventType.Response) {
          this.onUploadFinished.emit(event.body);
          this.getFiles();
          this.files[index].uploadStatus = 'Successfully uploaded!';
        }
      },
      error: (err: HttpErrorResponse) => {
        const index = this.files.findIndex((f) => f.name === files[0].name);
        this.files[index].uploadStatus = 'Upload failed!';
        console.log(err);
      },
    });
  }

  getFiles(): void {
    this.fileService.getFiles(this.fileParams).subscribe({
      next: (files) => {
        if (files.pagination) {
          this.dataSource = new MatTableDataSource(files.result);
          this.pagination = files.pagination;
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        this.errorMessage = err;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editFile(file: any) {
    this.dialog.open(FileEditComponent, {
      width: '600px',
      data: file,
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

  archiveFile(file: any) {
    this.fileService.softDeleteFile(file, file.id).subscribe({
      next: () => {
        this.getFiles();
        this.table.renderRows();
      },
      error: (err) => {
        this.errorMessage = err;
      },
    });
  }

  pageChanged(event: PageEvent) {
    this.fileParams.pageNumber = event.pageIndex + 1;
    this.fileParams.pageSize = event.pageSize;
    this.getFiles();
  }
}
