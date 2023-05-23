export class MediaFile {
  id: string;
  name: string;
  type: string;
  size!: number;
  fileUrl: string;
  createdAt!: Date;
  lastModifiedAt!: Date;
  thumbnailUrl!: string;
  isDeleted: boolean;

  constructor() {
    this.id = '';
    this.name = '';
    this.type = '';
    this.fileUrl = '';
    this.isDeleted = false;
  }
}
