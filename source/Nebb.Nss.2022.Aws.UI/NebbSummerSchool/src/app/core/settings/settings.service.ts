import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private baseUrl = 'https://localhost:7113/api';

  get baseEndpoint(): string {
    return this.baseUrl;
  }

  get dummyEndpoint(): string {
    return 'Dummy';
  }

  get filesEndpoint(): string {
    return 'Files';
  }

  get editEndpoint(): string {
    return 'Edit';
  }

  get archiveEndpoint(): string {
    return 'Archive';
  }

  get softDeleteEndpoint(): string {
    return 'isDeleted=true';
  }

  get restoreEndpoint(): string {
    return 'Restore';
  }

  get hardDeleteEndpoint(): string {
    return 'name=';
  }
}
