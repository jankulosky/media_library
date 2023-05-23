import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { DummyModel } from '../models/DummyModel';

@Injectable({
  providedIn: 'root'
})
export class DummyHttpServiceService {

  constructor(protected http: HttpClient, private settingsService: SettingsService) {
  }

  get(id: string): Observable<DummyModel> {
    let getByIdApiUrl = `${this.settingsService.baseEndpoint}/${this.settingsService.dummyEndpoint}/${id}`;
    return this.http.get<DummyModel>(getByIdApiUrl)
      .pipe(map(data => data), catchError(this.handleError));
  }

  handleError(er: HttpErrorResponse) {
    console.log(er.error);
    console.log(er.message);
    return throwError(() => er);
  }
}
