import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeComponent } from './home.component';
import { FileService } from 'src/app/core/services/file.service';
import { MediaFile } from 'src/app/core/models/MediaFiles';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let fileServiceSpy: jasmine.SpyObj<FileService>;

  beforeEach(async () => {
    fileServiceSpy = jasmine.createSpyObj([
      'getFiles',
      'postFile',
      'softDeleteFile',
    ]);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      declarations: [HomeComponent],
      providers: [{ provide: FileService, useValue: fileServiceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should upload files with simulated progress', () => {
    component.files = [
      { name: 'file1', progress: 0 },
      { name: 'file2', progress: 0 },
    ];

    component.uploadFilesSimulator(0);

    setTimeout(() => {
      expect(component.files[0].progress).toBeGreaterThan(0);
      expect(component.files[0].progress).toBeLessThanOrEqual(100);
      expect(component.files[1].progress).toBe(0);
    }, 5000);
  });

  it('should prepare files list', () => {
    const files = [
      new File([], 'file1'),
      new File([], 'file2'),
      new File([], 'file3'),
    ];
    component.prepareFilesList(files);
    expect(component.files.length).toEqual(3);
    expect(component.files[0].name).toEqual('file1');
    expect(component.files[0].progress).toEqual(0);
    expect(component.files[1].name).toEqual('file2');
    expect(component.files[1].progress).toEqual(0);
    expect(component.files[2].name).toEqual('file3');
    expect(component.files[2].progress).toEqual(0);
  });

  it('should remove file from list', () => {
    component.files = [
      { name: 'file1', progress: 100 },
      { name: 'file2', progress: 50 },
      { name: 'file3', progress: 0 },
    ];
    component.removeFileFromList(0);
    expect(component.files.length).toEqual(2);
    expect(component.files[0].name).toEqual('file2');
    expect(component.files[1].name).toEqual('file3');
  });

  it('should not remove file from list if upload is in progress', () => {
    component.files = [
      { name: 'file1', progress: 50 },
      { name: 'file2', progress: 0 },
    ];
    spyOn(console, 'log');
    component.removeFileFromList(0);
    expect(console.log).toHaveBeenCalledWith('Upload in progress.');
    expect(component.files.length).toEqual(2);
    expect(component.files[0].name).toEqual('file1');
    expect(component.files[1].name).toEqual('file2');
  });
});
