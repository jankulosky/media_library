import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FileService } from 'src/app/core/services/file.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { FileSizePipe } from 'src/app/core/pipes/file-size.pipe';
import { FileTypePipe } from 'src/app/core/pipes/file-type.pipe';
import { FileEditComponent } from './file-edit.component';
import { of } from 'rxjs';

describe('FileEditComponent', () => {
  let component: FileEditComponent;
  let fixture: ComponentFixture<FileEditComponent>;
  let fileServiceSpy: jasmine.SpyObj<FileService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<FileEditComponent>>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    fileServiceSpy = jasmine.createSpyObj('FileService', ['editFile']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      declarations: [FileEditComponent, FileTypePipe, FileSizePipe],
      providers: [
        { provide: FileService, useValue: fileServiceSpy },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileEditComponent);
    component = fixture.componentInstance;
    component.file = {
      id: '123',
      name: 'new-name.jpg',
      type: 'image/jpeg',
      size: 1024,
      createdAt: new Date(),
      lastModifiedAt: new Date(),
      fileUrl: 'https://example.com/image.jpg',
      thumbnailUrl: 'https://example.com/file-thumbnail.png',
      isDeleted: false,
    };
    component.editData = { ...component.file };
    component.ngOnInit();
    fixture.detectChanges();

    spyOn(component, 'updateFile');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set fileForm to valid', () => {
    expect(component.fileForm.valid).toBeTruthy();
  });

  it('should set form values to file properties', () => {
    expect(component.fileForm.value.name).toBe('new-name.jpg');
  });

  it('should update editData when form value changes', () => {
    component.fileForm.controls['name'].setValue('new-name.jpg');
    expect(component.editData.name).toBe('new-name.jpg');
  });

  it('should open confirm dialog when called and call updateFile when confirmed', () => {
    const confirmDialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', [
      'afterClosed',
    ]);
    confirmDialogRefSpyObj.afterClosed.and.returnValue(of(true));
    matDialogSpy.open.and.returnValue(confirmDialogRefSpyObj);

    component.openConfirmEditDialog();

    expect(matDialogSpy.open).toHaveBeenCalledOnceWith(jasmine.any(Function), {
      width: '400px',
      data: {
        dialogHeader: 'Update file',
        dialogContent: 'Are you sure you want to update',
        fileName: component.editData.name,
        cancelButtonLabel: 'Cancel',
        confirmButtonLabel: 'Confirm',
      },
    });
    expect(confirmDialogRefSpyObj.afterClosed).toHaveBeenCalled();
    expect(component.updateFile).toHaveBeenCalled();
  });
});
