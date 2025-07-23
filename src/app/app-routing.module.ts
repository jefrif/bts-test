import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {NotfoundComponent} from './demo/components/notfound/notfound.component';
import {AppLayoutComponent} from "./layout/app.layout.component";
import {LandingComponent} from "./pages/landing/landing.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        // path: '',
        // path: 'landing',
        path: '', component: LandingComponent,
        children: [
          {path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule)},
          {
            path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
          }
        ]
      },

      // {path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule)},
      // {/
      //   path: '',
      //   // path: 'landing',
      //   loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule)
      // },
      {path: 'notfound', component: NotfoundComponent},
      {path: '**', redirectTo: '/notfound'},
    ], {scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
