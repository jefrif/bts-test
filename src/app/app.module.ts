import {NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {BlockUIModule} from 'primeng/blockui';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AppLayoutModule} from './layout/app.layout.module';
import {NotfoundComponent} from './demo/components/notfound/notfound.component';
import {ProductService} from './demo/service/product.service';
import {CountryService} from './demo/service/country.service';
import {CustomerService} from './demo/service/customer.service';
import {EventService} from './demo/service/event.service';
import {IconService} from './demo/service/icon.service';
import {NodeService} from './demo/service/node.service';
import {PhotoService} from './demo/service/photo.service';
import {LandingModule} from "./pages/landing/landing.module";
// import {SafeHtmlPipe} from './pipes/safe-html/safe-html.pipe';
// import {ConfirmDaftarComponent} from './panels/layanan/confirm-daftar/confirm-daftar.component';

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent
        // , SafeHtmlPipe
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        LandingModule,
        BlockUIModule
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService
    ],
    bootstrap: [AppComponent],
    // exports: [
    //   SafeHtmlPipe
    // ]
})
export class AppModule { }
