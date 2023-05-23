import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MediaFile } from 'src/app/core/models/MediaFiles';

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.scss'],
})
export class FilePreviewComponent {
  file: MediaFile;

  constructor(@Inject(MAT_DIALOG_DATA) public data: MediaFile) {
    this.file = data;
  }
}
