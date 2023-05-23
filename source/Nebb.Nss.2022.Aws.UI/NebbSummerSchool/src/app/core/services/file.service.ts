import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FileParams } from '../models/fileParams';
import { MediaFile } from '../models/MediaFiles';
import { SettingsService } from '../settings/settings.service';
import {
  getPaginatedResult,
  getPaginationHeaders,
} from '../helpers/paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  getFiles(fileParams: FileParams) {
    let params = getPaginationHeaders(
      fileParams.pageNumber,
      fileParams.pageSize
    );

    params = params.append('orderBy', fileParams.orderBy);
    params = params.append('sortOrder', fileParams.sortOrder);
    params = params.append('searchBy', fileParams.searchBy);
    params = params.append('filterBy', fileParams.filterBy);

    return getPaginatedResult<MediaFile[]>(
      `${this.settingsService.baseEndpoint}/${this.settingsService.filesEndpoint}`,
      params,
      this.http
    ).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getFile(
    id: string,
    fileParams: FileParams
  ): Observable<MediaFile | undefined> {
    let params = getPaginationHeaders(
      fileParams.pageNumber,
      fileParams.pageSize
    );

    return this.http.get<MediaFile>(
      `${this.settingsService.baseEndpoint}/${this.settingsService.filesEndpoint}/${id}`,
      { params }
    );
  }

  getArchivedFile(
    id: string,
    fileParams: FileParams
  ): Observable<MediaFile | undefined> {
    let params = getPaginationHeaders(
      fileParams.pageNumber,
      fileParams.pageSize
    );

    return this.http.get<MediaFile>(
      `${this.settingsService.baseEndpoint}/${this.settingsService.filesEndpoint}/${id}?${this.settingsService.softDeleteEndpoint}`,
      { params }
    );
  }

  postFile(files: any) {
    let fileToUpload = <MediaFile>files[0];
    const formData: any = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    return this.http.post(
      `${this.settingsService.baseEndpoint}/${this.settingsService.filesEndpoint}`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  editFile(file: MediaFile) {
    return this.http.put(
      `${this.settingsService.baseEndpoint}/${this.settingsService.filesEndpoint}/${this.settingsService.editEndpoint}/`,
      file
    );
  }

  softDeleteFile(file: MediaFile, id: string) {
    return this.http.put(
      `${this.settingsService.baseEndpoint}/${this.settingsService.filesEndpoint}/${this.settingsService.archiveEndpoint}/` +
        id,
      file
    );
  }

  getDeletedFiles(fileParams: FileParams) {
    let params = getPaginationHeaders(
      fileParams.pageNumber,
      fileParams.pageSize
    );

    params = params.append('orderBy', fileParams.orderBy);
    params = params.append('sortOrder', fileParams.sortOrder);
    params = params.append('searchBy', fileParams.searchBy);
    params = params.append('filterBy', fileParams.filterBy);

    return getPaginatedResult<MediaFile[]>(
      `${this.settingsService.baseEndpoint}/${this.settingsService.filesEndpoint}?${this.settingsService.softDeleteEndpoint}`,
      params,
      this.http
    ).pipe(
      map((response) => {
        return response;
      })
    );
  }

  deleteFile(id: string) {
    return this.http.delete(
      `${this.settingsService.baseEndpoint}/${this.settingsService.filesEndpoint}/` +
        id +
        `?${this.settingsService.hardDeleteEndpoint}` +
        id
    );
  }

  restoreFile(file: MediaFile, id: string) {
    return this.http.put(
      `${this.settingsService.baseEndpoint}/${this.settingsService.filesEndpoint}/${this.settingsService.restoreEndpoint}/` +
        id,
      file
    );
  }
}
