import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileSizePipe } from 'src/app/core/pipes/file-size.pipe';
import { FileTypePipe } from 'src/app/core/pipes/file-type.pipe';
import { FilePreviewComponent } from './file-preview.component';

describe('FilePreviewComponent', () => {
  let component: FilePreviewComponent;
  let fixture: ComponentFixture<FilePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: '1',
            name: 'image.jpg',
            type: 'image/jpeg',
            size: 1024,
            url: 'http://example.com/image.jpg',
          },
        },
      ],
      declarations: [FilePreviewComponent, FileTypePipe, FileSizePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
