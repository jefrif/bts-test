import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
// import DOMPurify from 'dompurify';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {
  }

  transform(html: string): SafeHtml {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    // const sanitized = DOMPurify.sanitize(html/*, {ADD_TAGS: ['span'], ALLOWED_ATTR: ['style', 'class']}*/);
    // console.log(sanitized);
    // return sanitized;
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }
}
