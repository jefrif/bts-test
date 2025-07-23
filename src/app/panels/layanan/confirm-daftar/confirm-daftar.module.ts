import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CardModule} from 'primeng/card';
import {CalendarModule} from 'primeng/calendar';
import {TableModule} from 'primeng/table';
import {FieldsetModule} from "primeng/fieldset";
import {BlockUIModule} from 'primeng/blockui';
import {ConfirmDaftarComponent} from './confirm-daftar.component';
import {ConfirmDaftarRoutingModule} from './confirm-daftar-routing.module';

@NgModule({
  declarations: [ConfirmDaftarComponent],
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    CalendarModule,
    TableModule,
    FieldsetModule,
    BlockUIModule,
    ConfirmDaftarRoutingModule
  ]
})
export class ConfirmDaftarModule {

}
