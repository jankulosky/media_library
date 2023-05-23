import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveComponent } from './archive.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FileService } from 'src/app/core/services/file.service';
import { MediaFile } from 'src/app/core/models/MediaFiles';
import { of } from 'rxjs';
import { FilePreviewComponent } from '../files/file-preview/file-preview.component';

describe('ArchiveComponent', () => {
  let component: ArchiveComponent;
  let fixture: ComponentFixture<ArchiveComponent>;
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
      isDeleted: true,
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
      'getDeletedFiles',
      'getArchivedFile',
      'deleteFile',
      'restoreFile',
    ]);
    matDialogSpy = jasmine.createSpyObj(['open']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      declarations: [ArchiveComponent],
      providers: [
        {
          provide: FileService,
          useValue: fileServiceSpy,
        },
        {
          provide: MatDialog,
          useValue: matDialogSpy,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get deleted files on init', () => {
    spyOn(component, 'getDeleted');
    component.ngOnInit();
    expect(component.getDeleted).toHaveBeenCalled();
  });

  it('should call getDeleted', () => {
    fileServiceSpy.getDeletedFiles.and.returnValue(
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

    component.getDeleted();

    expect(fileServiceSpy.getDeletedFiles).toHaveBeenCalledWith(component.fileParams);
  });

  it('should open file preview dialog', () => {
    component.openDialog(mockFile);
    expect(matDialogSpy.open).toHaveBeenCalledWith(FilePreviewComponent, {
      data: mockFile,
    });
  });

  it('should restore a file', () => {
    fileServiceSpy.restoreFile.and.returnValue(of({}));
    spyOn(component, 'getDeleted');

    component.restoreFile(mockFile);

    expect(fileServiceSpy.restoreFile).toHaveBeenCalledWith(
      mockFile,
      mockFile.id
    );
    expect(component.getDeleted).toHaveBeenCalled();
  });

  it('should hard delete a file', () => {
    const id = '1';
    fileServiceSpy.deleteFile.and.returnValue(of({}));
    spyOn(component, 'getDeleted');

    component.hardDeleteFile(id);

    expect(fileServiceSpy.deleteFile).toHaveBeenCalledWith(id);
    expect(component.getDeleted).toHaveBeenCalled();
  });
});
