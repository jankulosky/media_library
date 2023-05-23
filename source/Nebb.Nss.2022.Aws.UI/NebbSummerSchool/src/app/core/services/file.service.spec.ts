import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { FileService } from './file.service';
import { SettingsService } from '../settings/settings.service';
import { MediaFile } from '../models/MediaFiles';
import { FileParams } from '../models/fileParams';
import { getPaginationHeaders } from '../helpers/paginationHelper';

describe('FileService', () => {
  let service: FileService;
  let settingsService: SettingsService;
  let httpMock: HttpTestingController;
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
  const mockFileParams: FileParams = {
    pageNumber: 1,
    pageSize: 6,
    isDeleted: false,
    orderBy: 'date',
    sortOrder: 'desc',
    searchBy: '',
    filterBy: 'allFiles',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileService, SettingsService],
    });
    service = TestBed.inject(FileService);
    settingsService = TestBed.inject(SettingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a file by ID', () => {
    service.getFile(mockFile.id, mockFileParams).subscribe((response) => {
      expect(response).toEqual(mockFile);
    });

    const mockUrl = `${settingsService.baseEndpoint}/${settingsService.filesEndpoint}/${mockFile.id}`;
    const mockParams = getPaginationHeaders(
      mockFileParams.pageNumber,
      mockFileParams.pageSize
    );

    const mockRequest = httpMock.expectOne(`${mockUrl}?${mockParams}`);

    expect(mockRequest.request.method).toBe('GET');

    mockRequest.flush(mockFile);
  });

  it('should return an archived file by ID', () => {
    service
      .getArchivedFile(mockFile.id, mockFileParams)
      .subscribe((response) => {
        expect(response).toEqual(mockFile);
      });

    const mockUrl = `${settingsService.baseEndpoint}/${settingsService.filesEndpoint}/${mockFile.id}?${settingsService.softDeleteEndpoint}`;
    const mockParams = getPaginationHeaders(
      mockFileParams.pageNumber,
      mockFileParams.pageSize
    );

    const mockRequest = httpMock.expectOne(`${mockUrl}&${mockParams}`);

    expect(mockRequest.request.method).toBe('GET');

    mockRequest.flush(mockFile);
  });

  it('should update the file', () => {
    service.editFile(mockFile).subscribe((response: any) => {
      expect(response.status).toBe(200);
    });

    const request = httpMock.expectOne(
      `${settingsService.baseEndpoint}/${settingsService.filesEndpoint}/${settingsService.editEndpoint}/`
    );
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(mockFile);
    request.flush({ status: 200 });
  });

  it('should soft delete a file', () => {
    service.softDeleteFile(mockFile, mockFile.id).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${settingsService.baseEndpoint}/${settingsService.filesEndpoint}/${settingsService.archiveEndpoint}/${mockFile.id}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should delete a file', () => {
    service.deleteFile(mockFile.id).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${settingsService.baseEndpoint}/${settingsService.filesEndpoint}/${mockFile.id}?${settingsService.hardDeleteEndpoint}${mockFile.id}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should restore a file', () => {
    service.restoreFile(mockFile, mockFile.id).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${settingsService.baseEndpoint}/${settingsService.filesEndpoint}/${settingsService.restoreEndpoint}/${mockFile.id}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});
