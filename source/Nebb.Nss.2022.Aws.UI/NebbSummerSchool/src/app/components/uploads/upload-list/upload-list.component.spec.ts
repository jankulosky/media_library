import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { UploadListComponent } from './upload-list.component';
import { FileService } from 'src/app/core/services/file.service';
import { of } from 'rxjs';
import { MediaFile } from 'src/app/core/models/MediaFiles';
import { FilePreviewComponent } from '../../files/file-preview/file-preview.component';

describe('UploadListComponent', () => {
  let component: UploadListComponent;
  let fixture: ComponentFixture<UploadListComponent>;
  let fileServiceSpy: jasmine.SpyObj<FileService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  const mockFiles: MediaFile[] = [
    {
      id: '1',
      name: 'image.jpg',
      type: 'image/jpeg',
      size: 1024,
      fileUrl: 'http://example.com/image.jpg',
      createdAt: new Date(),
      lastModifiedAt: new Date(),
      thumbnailUrl: 'http://example.com/thumbnail.jpg',
      isDeleted: false,
    },
  ];
  const mockFile: MediaFile = {
    id: '1',
    name: 'image.jpg',
    type: 'image/jpeg',
    size: 1024,
    fileUrl: 'http://example.com/image.jpg',
    createdAt: new Date(),
    lastModifiedAt: new Date(),
    thumbnailUrl: 'http://example.com/thumbnail.jpg',
    isDeleted: false,
  };

  beforeEach(async () => {
    fileServiceSpy = jasmine.createSpyObj([
      'getFiles',
      'getFile',
      'softDeleteFile',
    ]);
    matDialogSpy = jasmine.createSpyObj(['open']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      declarations: [UploadListComponent],
      providers: [
        {
          provide: FileService,
          useValue: fileServiceSpy,
        },
        { provide: MatDialog, useValue: matDialogSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get files on init', () => {
    spyOn(component, 'getFiles');
    component.ngOnInit();
    expect(component.getFiles).toHaveBeenCalled();
  });

  it('should call getFiles', () => {
    fileServiceSpy.getFiles.and.returnValue(
      of({
        result: mockFiles,
        pagination: {
          currentPage: 1,
          itemsPerPage: 6,
          totalItems: 1,
          totalPages: 1,
        },
      })
    );

    component.getFiles();

    expect(fileServiceSpy.getFiles).toHaveBeenCalledWith(component.fileParams);
  });

  it('should open file preview dialog', () => {
    component.openDialog(mockFile);
    expect(matDialogSpy.open).toHaveBeenCalledWith(FilePreviewComponent, {
      data: mockFile,
    });
  });

  it('should open the file edit dialog', () => {
    const file: MediaFile = new MediaFile();
    spyOn(component, 'editFile');

    component.editFile(file);

    expect(component.editFile).toHaveBeenCalledWith(file);
  });

  it('should call softDeleteFile', () => {
    const file: MediaFile = new MediaFile();
    file.id = '1';
    fileServiceSpy.softDeleteFile.and.returnValue(of({}));
    spyOn(component, 'getFiles');

    component.archiveFile(file);

    expect(fileServiceSpy.softDeleteFile).toHaveBeenCalledWith(file, '1');
    expect(component.getFiles).toHaveBeenCalled();
  });
});
