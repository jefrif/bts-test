import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, Subscription, takeUntil} from "rxjs";
import {MenuItem, Message, MessageService} from "primeng/api";
import {CommonService} from "src/app/services/common.service";
import {FileIndexService} from "src/app/services/file-index.service";
import {MenuModule} from "primeng/menu";
import {MenubarModule} from "primeng/menubar";
import {CommonModule} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {DialogModule} from "primeng/dialog";
import {ToastModule} from "primeng/toast";
import {BlockUIModule} from "primeng/blockui";
import {ButtonModule} from "primeng/button";
import {LandingRoutingModule} from "./landing-routing.module";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  providers: [MessageService]
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {

  documentClickListener: any;
  // items: MenuItem[];
  mbItems: MenuItem[] = [];
  sideDisplay = 'none';
  blocked = true;
  displayInfo?: boolean;
  txtSearch?: string;
  userName?: string;
  private mesgSubjSubsc?: Subscription;
  private blockSubjSubsc?: Subscription;
  private anySubjSubsc?: Subscription;
  private folderIdxPath?: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public renderer: Renderer2, private service: CommonService,
              private msgService: MessageService, private router: Router,
              private filexService: FileIndexService) {
  }

// TODO: DISplay info when icon clicked
  ngAfterViewInit(): void {
    // this.service.getBlockSubject().next(true);
    setTimeout(() => {
      this.initFolderIdxPath();
      this.blockSubjSubsc = this.service.getBlockSubject().subscribe(value => {
        this.blocked = value;
      });
      this.blocked = false;
    });
  }

  ngOnInit(): void {
    // this.initFolderIdxPath();
    this.mesgSubjSubsc = this.service.getMesgSubject().subscribe((value: Message) => {
      this.msgService.add(value);
    });
    /*
        this.anySubjSubsc = this.service.getAnySubject().subscribe(value => {
          if (value.indexPath) {
            this.indexPath = value.indexPath;
          }
        });
    */

    /*
        const sSubItems: MenuItem[] = [];
        sSubItems.push({
          label: 'User', icon: 'pi pi-fw pi-user-plus', command: (event) => {
            // event.originalEvent   // Browser event
            // event.item    // menuitem metadata
            this.onSelectHome();
          }
        } as MenuItem);

        sSubItems.push({label: 'Filter', icon: 'pi pi-fw pi-filter'} as MenuItem);

        let subItems: MenuItem[] = [];
        subItems.push({
          // label: 'New', expanded: false, icon: 'pi pi-fw pi-plus', items: sSubItems
          label: 'New', expanded: false, icon: PrimeIcons.PLUS_CIRCLE, items: sSubItems
        } as MenuItem);

        subItems.push({label: 'Open', icon: 'pi pi-fw pi-external-link', command: (event) => {
            // event.originalEvent   // Browser event
            // event.item    // menuitem metadata

            // this.router.navigate(['fexpr'])
            //     .then(() => {
                  setTimeout(() => {
                    this.service.getAnySubject().next({
                      cmd: 'test'
                    });
                  });
                // });
          }
        } as MenuItem);

        subItems.push({separator: true} as MenuItem);

        subItems.push({
          label: 'Quit', icon: 'pi pi-fw pi-times'
        } as MenuItem);

        this.items = [] as MenuItem[];
        this.items.push({
          label: 'File', expanded: false, icon: 'pi pi-pw pi-file', items: subItems
        } as MenuItem);

        subItems = [];

        subItems.push({
          label: 'Delete (Home)', icon: 'pi pi-fw pi-trash', routerLink: '/home'
        } as MenuItem);

        subItems.push({
          label: 'Refresh', icon: 'pi pi-fw pi-refresh', routerLink: '/about'
        } as MenuItem);

        this.items.push({
          label: 'Edit', expanded: false, icon: 'pi pi-fw pi-pencil', items: subItems
        } as MenuItem);
    */

    this.mbItems = [{
      label: 'File',
      expanded: false,
      icon: 'pi pi-pw pi-file',
      items: [{
        label: 'Explore',
        icon: 'pi pi-fw pi-list',
        command: () => {
          this.onMenuClickExplore();
        }
        /*
                items: [
                  {
                    label: 'User', icon: 'pi pi-fw pi-user-plus', command: (event) => {
                      // event.originalEvent   // Browser event
                      // event.item    // menuitem metadata
                      this.onSelectHome();
                    }
                  },
                  {label: 'Filter', icon: 'pi pi-fw pi-filter'}
                ]
        */
      }, {
        label: 'Upload', icon: 'pi pi-fw pi-upload', command: () => {
          this.onMenuClickUpload();
        }
        // }, {
        //   label: 'Quit', icon: 'pi pi-fw pi-times'
      }, {
        label: 'Open', icon: 'pi pi-fw pi-file-o', command: () => {
          this.onMenuClickOpenFile();
        }
      }, {
        separator: true
      }, {
        label: 'Admin', icon: 'pi pi-fw pi-cog', command: () => {
          this.onMenuClickAdmin();
        }
      }, {
        label: 'Info', icon: 'pi pi-fw pi-info-circle', command: () => {
          this.displayInfo = true;
        }
      }, {
        label: 'Test', icon: 'pi pi-fw pi-info-circle', command: () => {
          this.router.navigate(['fexpr']).then(() => {
            setTimeout(() => {
              this.service.getAnySubject().next({
                cmd: 'test'
              });
            });
          });
        }
      }]
    },
    {
      // label: 'File',
      expanded: false,
      icon: 'pi pi-pw pi-user',
      items: [{
        label: 'Login',
        icon: 'pi pi-fw material-icons mi-login',
        command: () => {
          this.router.navigate(['auth/login']).then();
        }
      }, {
        label: 'Logout',
        icon: 'pi pi-fw material-icons mi-logout',
        command: () => {
          this.logOut();
        }
      }]
    },
    {
      icon: 'pi pi-pw material-icons mi-help',
      command: () => {
        this.router.navigate(['gdocs']).then();
      }
    }];
    /*
        this.items = [{
          label: 'File',
          expanded: false,
          icon: 'pi pi-pw pi-file',
          items: [{
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            items: [
              {
                label: 'User', icon: 'pi pi-fw pi-user-plus', command: (event) => {
                  // event.originalEvent   // Browser event
                  // event.item    // menuitem metadata
                  this.onSelectHome();
                }
              },
              {label: 'Filter', icon: 'pi pi-fw pi-filter'}
            ]
          }, {label: 'Open', icon: 'pi pi-fw pi-external-link'}, {separator: true}, {
            label: 'Quit',
            icon: 'pi pi-fw pi-times'
          }]
        }, {
          label: 'Edit',
          icon: 'pi pi-fw pi-pencil',
          items: [
            {label: 'Delete', icon: 'pi pi-fw pi-trash', routerLink: '/home'},
            {label: 'Refresh', icon: 'pi pi-fw pi-refresh', routerLink: '/about'}
          ]
        }, {
          label: 'Help',
          icon: 'pi pi-fw pi-question',
          items: [{label: 'Contents', icon: 'pi pi-pi pi-bars'}, {
            label: 'Search',
            icon: 'pi pi-pi pi-search',
            items: [{label: 'Text', items: [{label: 'Workspace'}]}, {label: 'User', icon: 'pi pi-fw pi-file',}]
          }]
        }, {
          label: 'Actions',
          icon: 'pi pi-fw pi-cog',
          items: [{
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            items: [{label: 'Save', icon: 'pi pi-fw pi-save'}, {label: 'Update', icon: 'pi pi-fw pi-save'},]
          }, {label: 'Other', icon: 'pi pi-fw pi-tags', items: [{label: 'Delete', icon: 'pi pi-fw pi-minus'}]}]
        }];
     */

    this.documentClickListener = this.renderer.listen(
        'body', 'click', (event) => {
          this.sideDisplay = 'none';
        });
    this.anySubjSubsc = this.service.getAnySubject().subscribe(value => {
      if (value.cmd === 'login') {
        this.userName = value.userName;
      }
    });
  }

  ngOnDestroy(): void {
    this.mesgSubjSubsc?.unsubscribe();
    this.blockSubjSubsc?.unsubscribe();
    this.anySubjSubsc?.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onMenuButtonClick(event: Event) {
    // console.log(event);
    // this.sidebarActive = true;
    if (this.sideDisplay === 'none') {
      this.sideDisplay = 'block';
    } else {
      this.sideDisplay = 'none';
    }

    event.stopPropagation();
  }

  onSelectHome() {
    this.sideDisplay = 'none';
    // this.visibility = 'hidden';
  }

  onClickSidePanel(ev: any) {
    ev.stopPropagation();
  }

  onClickSearch() {   // TODO: enter pressed
    if (!this.txtSearch) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Perhatian!',
        detail: 'Masukkan teks yang ingin dicari'
      });
      return;
    }

    const param = {
      cmd: 'search',
      txt: this.txtSearch,
      folderIdxPath: this.folderIdxPath
    };
    if (window.location.href.endsWith('/fexpr')/* && this.indexPath*/) {
      // param = Object.assign(param, {indexPath: this.indexPath});
      this.service.getAnySubject().next(param);
      return;
    }

    this.router.navigate(['home'])
        .then(() => {
          setTimeout(() => {
            this.service.getAnySubject().next(param);
          });
        });
  }

  onMenuClickExplore() {
    this.router.navigate(['fexpr']).then();
  }

  onMenuClickUpload() {
    if (window.location.pathname === '/fexpr') {
      this.service.getAnySubject().next({cmd: 'upload'});
      return;
    }

    this.router.navigate(['fexpr']).then(() => {
          setTimeout(() => {
            this.service.getAnySubject().next({cmd: 'upload'});
          });
        }
    );
  }

  onMenuClickOpenFile() {
    if (window.location.pathname === '/fexpr') {
      this.service.getAnySubject().next({cmd: 'open'});
      return;
    }

    this.router.navigate(['fexpr']).then(() => {
          setTimeout(() => {
            this.service.getAnySubject().next({cmd: 'open'});
          });
        }
    );
  }

  onMenuClickAdmin() {
    this.router.navigate(['admin']).then(() => {
    });
  }

  onClickBtnLogin() {
    this.router.navigate(['auth/login']).then(() => {
    });
  }

  onClickTest() {
    // this.service.getSubject().next({
    //   cmd: 'test'
    // });
  }

  private initFolderIdxPath() {
    this.service.getBlockSubject().next(true);
    const body = {
      method: 1,
      indexName: 'docsfolders'
    };
    const {mit} = CommonService.getCurrentTimeStr();

    // this.service.httpGet(/*this.folderName*/'docsfolders', environment.urlAdil)
    this.service.httpPut(`searchet?mit=${mit}`, body)
        .pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.folderIdxPath = res.docsfolders.settings.index.uuid;
      this.service.getBlockSubject().next(false);
    }, () => {
      this.showErrorMsg(mit, 'Folders index cannot be retrieved');
    })
  }

  // noinspection DuplicatedCode
  private createFolderIndex() {
    const body = {
      method: 4,
      indexName: 'docsfolders',
      body: JSON.stringify(this.filexService.createFolderIndexBody())
    };
    const {mit} = CommonService.getCurrentTimeStr();

    this.service.httpPut(`searchet?mit=${mit}`, body)
        .pipe(takeUntil(this.destroy$)).subscribe(res => {
      console.log(res);
      this.initFolderIdxPath();
    }, () => {
      this.showErrorMsg(mit, 'Create folder index failed');
    })
  }

  private showErrorMsg(mit: string, summary: string, action: any = null) {
    this.service.httpGet(`excevlet?mit=${mit}`)
        .pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.mesg?.toString().startsWith('no such index')) {
        if (res.mesg.toString().endsWith('[docsfolders]')) {
          this.createFolderIndex();
        } else {
          if (action) {
            action();
          }
        }
        return;
      }
      console.log(res);
      this.service.getBlockSubject().next(false);
      this.service.getMesgSubject().next({
        severity: 'error', summary, detail: res.mesg
      });
    }, err => {
      this.service.getBlockSubject().next(false);
      this.service.getMesgSubject().next({
        severity: 'error', summary, detail: err
      });
    })
  }

  private logOut() {
    if (!localStorage.getItem("gib")) {
      return;
    }

    const reqBody = {
      gib: localStorage.getItem("gib")
    };

    this.service.httpPut('auth', reqBody)
        .pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if (res.done) {
          this.router.navigate(['auth/login']).then(() => {
            localStorage.removeItem("gib");
            setTimeout(() => {
              this.service.getAnySubject().next({
                cmd: 'login',
                userName: ''
              });
            });
          });
        }
      }, // success path
      error: (err) => {
        this.service.getMesgSubject().next({
          severity: 'error', summary: 'Logout failed', detail: err
        });
      }
    })

  }

  /*
    private initFolderIdxPath() {
      this.service.getBlockSubject().next(true);
      const body = {
        method: 1,
        indexName: 'docsfolders'
      };

      const {mit} = FexploreComponent.getCurrentTime();
      // const subsc = this.service.httpGet(/!*this.folderName*!/'docsfolders', environment.urlAdil)
      const subsc = this.service.httpPut(`searchet?mit=${mit}`, body)
          .subscribe(res => {
            this.folderIdxPath = res.docsfolders.settings.index.uuid;
            subsc.unsubscribe();
          }, error => {
            subsc.unsubscribe();
            this.service.getBlockSubject().next(false);
            this.service.getMesgSubject().next({
              severity: 'error',
              summary: 'Folders index cannot be retrieved',
              detail: error
            });
          })
    }
  */
}
