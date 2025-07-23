import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {PaginatorModule} from 'primeng/paginator';
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
import {SplitterModule} from 'primeng/splitter';
import {TreeModule} from 'primeng/tree';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ContextMenuModule} from 'primeng/contextmenu';
import {AccordionModule} from 'primeng/accordion';
import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {PipesModule} from "../../pipes/pipes.module";


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    DividerModule,
    StyleClassModule,
    ChartModule,
    PanelModule,
    ButtonModule,
    MenuModule,
    MenubarModule,
    CardModule,
    InputTextModule,
    PaginatorModule,
    DialogModule,
    ToastModule,
    BlockUIModule,
    SplitterModule,
    TreeModule,
    ConfirmPopupModule,
    ContextMenuModule,
    AccordionModule,
    PipesModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule {
}
