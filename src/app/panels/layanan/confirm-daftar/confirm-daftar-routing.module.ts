import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ConfirmDaftarComponent} from "./confirm-daftar.component";

@NgModule({
  imports: [RouterModule.forChild([
    {path: '', component: ConfirmDaftarComponent}
  ])],
  exports: [RouterModule]
})
export class ConfirmDaftarRoutingModule {
}
