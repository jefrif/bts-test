import { Component, ElementRef, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, public router: Router) { }

  onClickBtnLogin() {
    this.router.navigate(['auth/login']).then(() => {});
  }

  onClickBtnCalendar() {
    this.router.navigate(['fexpr']).then(() => {});
  }
}
