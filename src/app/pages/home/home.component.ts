/* eslint-disable object-shorthand,@typescript-eslint/naming-convention */
import {Component, OnDestroy, OnInit, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
// import {Subject, Subscription} from 'rxjs';
// import {takeUntil} from 'rxjs/operators';
import {CommonService} from 'src/app/services/common.service';
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  txtTodo: string = '';
  tabs = [
    { title: 'Planning', content: 'Content 1' },
    { title: 'Learning', content: 'Content 2' },
    { title: 'Shopping', content: 'Content 3' }
  ];
  dlgRegVisible = false;
  email = '';
  password = '';
  username = '';
  dlgHeader = "Register"
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private service: CommonService, private router: Router) {
  }

  ngOnInit(): void {
    // this.anySubjSubsc = this.service.getAnySubject().subscribe(value => {
    //   if (value.cmd === 'search') {
    //     if (value.txt && value.txt.trim().length > 0) {
    //       this.searchTxt = value.txt;
    //       this.indexPath = value.indexPath ? value.indexPath : '*';
    //       this.folderIdxPath = value.folderIdxPath;
    //       this.indexName = value.indexName;
    //       this.doSearch();
    //     }
    //   }
    // });
    console.log("init")
  }

  ngAfterViewInit() {
    this.dlgRegVisible = true;
  }

  ngOnDestroy(): void {
    // this.anySubjSubsc.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.complete();
    console.log("destroy")
  }

  onClickAdd() {
    console.log("add")
  }

  onOkRegister() {
    console.log(this.username, this.email, this.password);
    this.service.httpPost(`register`,
      {username: this.username, password: this.password, email: this.email})
      .pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        // console.log(this.jwtHelper.decodeToken(res.token));
        console.log(res);
        localStorage.setItem("gib", res.gib);
        // const dtok = this.jwtHelper.decodeToken(res.token);

      }, error: err => {
        console.log(err);
        this.service.getBlockSubject().next(false);
        this.router.navigate(['home']).then();
      }, complete: () => {
        this.service.getBlockSubject().next(false);
      }
    })

  }
}
