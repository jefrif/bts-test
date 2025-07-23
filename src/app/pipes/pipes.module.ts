import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SafeHtmlPipe} from './safe-html.pipe';

@NgModule({
  declarations: [SafeHtmlPipe],
  imports: [
    CommonModule
  ],
  entryComponents: [SafeHtmlPipe],
  exports: [SafeHtmlPipe]
})
export class PipesModule { }
