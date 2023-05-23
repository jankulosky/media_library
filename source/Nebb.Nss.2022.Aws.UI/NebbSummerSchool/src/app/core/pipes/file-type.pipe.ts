import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileType',
})
export class FileTypePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    const split = value.split('/');

    return `.${split[1]}`;
  }
}
