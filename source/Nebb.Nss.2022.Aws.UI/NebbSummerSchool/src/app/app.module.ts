import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DummyHttpServiceService } from './core/services/dummy-http-service.service';
import { SettingsService } from './core/settings/settings.service';
import { DummyComponent } from './components/dummy/dummy.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UploadListComponent } from './components/uploads/upload-list/upload-list.component';
import { FileEditComponent } from './components/files/file-edit/file-edit.component';
import { FileTypePipe } from './core/pipes/file-type.pipe';
import { ArchiveComponent } from './components/archive/archive.component';
import { FileSizePipe } from './core/pipes/file-size.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { ServerErrorComponent } from './components/errors/server-error/server-error.component';
import { ConfirmDialogComponent } from './components/modals/confirm-dialog/confirm-dialog.component';
import { FilePreviewComponent } from './components/files/file-preview/file-preview.component';
import { DraganddropDirective } from './core/directives/draganddrop.directive';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  declarations: [
    AppComponent,
    DummyComponent,
    NavComponent,
    HomeComponent,
    FileEditComponent,
    UploadListComponent,
    FileSizePipe,
    FileTypePipe,
    ArchiveComponent,
    FooterComponent,
    ConfirmDialogComponent,
    NotFoundComponent,
    ServerErrorComponent,
    FilePreviewComponent,
    DraganddropDirective,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
    PaginationModule.forRoot(),
  ],
  providers: [
    SettingsService,
    DummyHttpServiceService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
