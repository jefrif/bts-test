import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {DialogModule} from 'primeng/dialog';
import {StyleClassModule} from 'primeng/styleclass';
import {DividerModule} from 'primeng/divider';
import {ChartModule} from 'primeng/chart';
import {PanelModule} from 'primeng/panel';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import {ToastModule} from 'primeng/toast';
import {BlockUIModule} from 'primeng/blockui';
import {LandingRoutingModule} from './landing-routing.module';
import {LandingComponent} from './landing.component';

@NgModule({
    imports: [
        CommonModule,
        LandingRoutingModule,
        FormsModule,
        DividerModule,
        StyleClassModule,
        ChartModule,
        PanelModule,
        ButtonModule,
        MenuModule,
        MenubarModule,
        InputTextModule,
        DialogModule,
        ToastModule,
        BlockUIModule
    ],
    declarations: [LandingComponent],
    exports: [LandingComponent]
})
export class LandingModule {
}
