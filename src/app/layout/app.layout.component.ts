import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter, Subscription} from 'rxjs';
import {/*BlockableUI,*/ ConfirmationService, Message, MessageService} from 'primeng/api';
import {LayoutService} from './service/app.layout.service';
import {AppSidebarComponent} from './app.sidebar.component';
import {AppTopBarComponent} from './app.topbar.component';
import {GMessageState, IconfirmDialogState} from 'src/app/api/confirm-dialog-msg';
import {CommonService} from 'src/app/services/common.service';

@Component({
  selector: 'app-layout',
  templateUrl: './app.layout.component.html'
})
export class AppLayoutComponent implements OnInit, OnDestroy/*, BlockableUI*/ {

  // @ViewChild('pnl') pnlMain!: ElementRef;
  // @ts-ignore
  overlayMenuOpenSubscription: Subscription;

  menuOutsideClickListener: any;

  profileMenuOutsideClickListener: any;

  @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

  @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

  private subscrMessg!: Subscription;
  // private subscrMsgDlg!: Subscription;
  private subscrConfirmDlg!: Subscription;
  mesgs: Message[] = [];
  acceptLabel: string | undefined = 'OK';
  rejectLabel: string | undefined = 'Batal';
  // cfdHeader: string | undefined = 'Confirmation';

  constructor(public layoutService: LayoutService, public renderer: Renderer2,
              public router: Router, private commonSvc: CommonService,
              private confirmationService: ConfirmationService, private messageService: MessageService) {
/*
const x = 1;
    this.router.navigate(['auth/login'])
        .then(() => {
          setTimeout(() => {

          });
        });

    if (x === 1) {
      return;
    }
*/

    this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
      if (!this.menuOutsideClickListener) {
        this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
          const isOutsideClicked = !(this.appSidebar.el.nativeElement.isSameNode(event.target) || this.appSidebar.el.nativeElement.contains(event.target)
              || this.appTopbar.menuButton.nativeElement.isSameNode(event.target) || this.appTopbar.menuButton.nativeElement.contains(event.target));

          if (isOutsideClicked) {
            this.hideMenu();
          }
        });
      }

      if (!this.profileMenuOutsideClickListener) {
        this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
          const isOutsideClicked = !(this.appTopbar.menu.nativeElement.isSameNode(event.target) || this.appTopbar.menu.nativeElement.contains(event.target)
              || this.appTopbar.topbarMenuButton.nativeElement.isSameNode(event.target) || this.appTopbar.topbarMenuButton.nativeElement.contains(event.target));

          if (isOutsideClicked) {
            this.hideProfileMenu();
          }
        });
      }

      if (this.layoutService.state.staticMenuMobileActive) {
        this.blockBodyScroll();
      }
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.hideMenu();
          this.hideProfileMenu();
        });
  }

  hideMenu() {
    this.layoutService.state.overlayMenuActive = false;
    this.layoutService.state.staticMenuMobileActive = false;
    this.layoutService.state.menuHoverActive = false;
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
    this.unblockBodyScroll();
  }

  hideProfileMenu() {
    this.layoutService.state.profileSidebarVisible = false;
    if (this.profileMenuOutsideClickListener) {
      this.profileMenuOutsideClickListener();
      this.profileMenuOutsideClickListener = null;
    }
  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
          'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  get containerClass() {
    return {
      'layout-theme-light': this.layoutService.config.colorScheme === 'light',
      'layout-theme-dark': this.layoutService.config.colorScheme === 'dark',
      'layout-overlay': this.layoutService.config.menuMode === 'overlay',
      'layout-static': this.layoutService.config.menuMode === 'static',
      'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config.menuMode === 'static',
      'layout-overlay-active': this.layoutService.state.overlayMenuActive,
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
      'p-input-filled': this.layoutService.config.inputStyle === 'filled',
      'p-ripple-disabled': !this.layoutService.config.ripple
    }
  }

  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
    this.subscrConfirmDlg.unsubscribe();
    this.subscrMessg.unsubscribe();
  }

  ngOnInit(): void {
    this.subscrMessg = this.commonSvc.gmessgState
        .subscribe((state: GMessageState) => {
          this.messageService.add({severity: state.severity, summary: state.summary, detail: state.detail});
        });
    this.subscrConfirmDlg = this.commonSvc.confirmDlgState
        .subscribe((state: IconfirmDialogState) => {
              const comp = state.param;
              this.acceptLabel = comp?.acceptLabel;
              this.rejectLabel = comp.rejectLabel;

              this.confirmationService.confirm({
                header: comp.header,
                message: comp.message,
                icon: comp.icon,
                key: comp.key,
                rejectVisible: comp.rejectVisible,
                accept: () => {
                  if (comp.accept != null) {
                    comp.accept();
                  }
                },
                reject: () => {
                  if (comp.reject != null) {
                    comp.reject();
                  }
                }
              });
            }
        );
  }

/*
  getBlockableElement(): HTMLElement {
    return this.pnlMain.nativeElement;
  }
*/
}
