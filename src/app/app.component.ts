import {Component, OnInit, OnDestroy} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {Subscription} from "rxjs";
import * as signalR from '@microsoft/signalr';
import {CommonService} from "./services/common.service";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  blocked: boolean = false;
  private blockSubjSubsc!: Subscription;
  private hubConnection!: signalR.HubConnection;

  constructor(private primengConfig: PrimeNGConfig, private commonSvc: CommonService) {
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.blockSubjSubsc = this.commonSvc.getBlockSubject().subscribe(value => {
      this.blocked = value;
    });
    // this.startConnection();
  }

  ngOnDestroy(): void {
    this.blockSubjSubsc.unsubscribe();
  }

/*
  private startConnection() {
    let url = environment.urlApi;
    url = url.substring(0, url.length - 3) + 'datach';
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(url).build();

    this.hubConnection.start()
        .then(() => {
          console.log('Connection started');
          this.addBackDataChangedListener();
        })
        .catch(err => console.log('Error while starting connection: ' + err));
  }
*/

  private addBackDataChangedListener() {
    this.hubConnection.on('bkdatachanged', (data) => {
      // console.log(`bkdatachanged: ${data}`);
      this.commonSvc.getDataChangedSubject().next(data);
    });
  }
}
