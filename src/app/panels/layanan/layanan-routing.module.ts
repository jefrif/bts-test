import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'cfmdft', loadChildren: () => import('./confirm-daftar/confirm-daftar.module')
          .then(m => m.ConfirmDaftarModule)
    },
    {path: '**', redirectTo: '/notfound'}
  ])],
  exports: [RouterModule]
})
export class LayananRoutingModule {
}
