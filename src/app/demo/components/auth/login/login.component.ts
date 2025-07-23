import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from "rxjs/operators";
import {JwtHelperService} from '@auth0/angular-jwt';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {CommonService} from "../../../../services/common.service";
import {environment} from "../../../../../environments/environment";
import {IaccessViewRole} from "../../../../api/iaccess-view-role";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
          transform: scale(1.6);
          margin-right: 1rem;
          color: var(--primary-color) !important;
      }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {

  valCheck: string[] = ['remember'];

  password!: string;
  userName!: string;
  jwtHelper: JwtHelperService;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public layoutService: LayoutService, public router: Router,
              private commonSvc: CommonService) {
    this.jwtHelper = new JwtHelperService();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.onClickBtnSignIn(1);
    }, 3000);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onClickBtnSignIn(ev: any) {
    this.commonSvc.getBlockSubject().next(true);
    if (ev) {
      this.userName = 'ganjar';
      this.password = 'pranowo';
    }
    this.commonSvc.httpPost(`auth`,
        {name: this.userName, passwd: this.password})
        .pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        // console.log(this.jwtHelper.decodeToken(res.token));
        localStorage.setItem("gib", res.gib);
        console.log(res);
        // const dtok = this.jwtHelper.decodeToken(res.token);

        this.router.navigate(['fexpr']).then(() => {
          setTimeout(() => {
            this.commonSvc.getAnySubject().next({
              cmd: 'login',
              userName: this.userName
            });
          });
        });
      }, error: err => {
        console.log(err);
        this.commonSvc.getBlockSubject().next(false);
        this.router.navigate(['home']).then();
      }, complete: () => {
        this.commonSvc.getBlockSubject().next(false);
      }
    })
  }
}
