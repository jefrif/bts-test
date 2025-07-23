import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import {JwtHelperService} from "@auth0/angular-jwt";
import {catchError, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {environment} from 'src/environments/environment';
import {IaccessViewRole} from 'src/app/api/iaccess-view-role';
import {ConfirmDialogMsg, GMessageState, IconfirmDialogState} from 'src/app/api/confirm-dialog-msg';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private blockSubject = new Subject<boolean>();    // screen block
  private blockSubjectAdmin = new Subject<boolean>();    // admin panel block
  jwtHelper: JwtHelperService;
  private dataChgdSubject = new Subject<number>();
  private gmessgSubject = new Subject<GMessageState>();
  private confirmDlgSubject = new Subject<IconfirmDialogState>();
  gmessgState = this.gmessgSubject.asObservable();
  confirmDlgState = this.confirmDlgSubject.asObservable();
  private anySubject = new Subject<any>();

  constructor(private http: HttpClient, private router: Router) {
    this.jwtHelper = new JwtHelperService();
  }

  private static mimeTypes: any = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    doc: 'application/msword',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls: 'application/vnd.ms-excel',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ppt: 'application/vnd.ms-powerpoint',
    png: 'image/png',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    mp4: 'video/vnd.uvvu.mp4'
  };

  static getCurrentTimeStr() {
    const now = new Date();
    const offset = now.getTimezoneOffset() / 60;
    const tglNow = new Date(now.getTime());
    tglNow.setHours(now.getHours() - offset, now.getMinutes(),
        now.getSeconds(), now.getMilliseconds());
    const waktuStr = tglNow.toISOString();
    let mit = waktuStr.replace(/[^a-z0-9]/gi, 'X');
    mit += Math.random().toString(36).substring(2);
    return {waktuStr, mit};
  }

  httpGet(url: string, jwtAuth = false, params?: HttpParams,
          baseUrl: string = environment.urlAdil): Observable<any> {
    const httpOptions = CommonService.initHttpOptions(jwtAuth, params);

    return this.http.get<any>(`${baseUrl}/${url}`, httpOptions)
        .pipe(catchError((error) => {
          throw /*CommonService*/this.handleError(error);
        }));
  }

  private static initHttpOptions(jwtAuth: boolean, params: HttpParams | undefined,
                                 headers: any = null) {
    // let httpParams = new HttpParams();
    if (!headers) {
      headers = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
        'Accept': 'application/json; charset=utf-8',
        // 'Accept': 'application/json'
        // eslint-disable-next-line @typescript-eslint/naming-convention
        // 'Authorization': 'Basic ZWxhc3RpYzpuUXlqNzMzNmlSU3BKb0hJOE4zcQ=='
      }
    } else if (headers['Content-Type'] === 'multipart-form-data') {
      console.log('multipart-form-data');
      headers = {};
    } else if (!headers['Content-Type'] && !headers['Accept']) {
      headers = Object.assign(headers, {
        'Content-Type': 'application/json',
        'Accept': 'application/json; charset=utf-8'
      });
    }

    const gib = localStorage.getItem("gib");
    if (gib) {
      headers = Object.assign(headers, {
        'Authorization': gib
      });
    }

    if (jwtAuth) {
      headers = Object.assign(headers, {
        'Authorization': 'Bearer ' + localStorage.getItem("access_token")
      });
    }

    let httpOptions = {
      headers: new HttpHeaders(headers)
      // params: new HttpParams().set('type', mimeType).set('fp', filePath),
      // responseType: 'blob' as const
    };

    if (params) {
      httpOptions = Object.assign(httpOptions, {params: params});
    }
    return httpOptions;
  }

  httpPost(url: string, body: any, jwtAuth = false, headers: any = null,
           params?: HttpParams, baseUrl: string = environment.urlAdil): Observable<any> {
    const httpOptions = CommonService.initHttpOptions(jwtAuth, params, headers);

    return this.http.post<any>(`${baseUrl}/${url}`, body, httpOptions)
        .pipe(catchError((error) => {
          throw /*CommonService*/this.handleError(error);
        }));
  }

  httpPut(url: string, body: any, jwtAuth = false, headers: any = null,
           params?: HttpParams, baseUrl: string = environment.urlAdil): Observable<any> {
    const httpOptions = CommonService.initHttpOptions(jwtAuth, params, headers);

    return this.http.put<any>(`${baseUrl}/${url}`, body, httpOptions)
        .pipe(catchError((error) => {
          throw /*CommonService*/this.handleError(error);
        }));
  }

  httpPatch(url: string, body: any, jwtAuth = false, headers: any = null,
           params?: HttpParams, baseUrl: string = environment.urlAdil): Observable<any> {
    const httpOptions = CommonService.initHttpOptions(jwtAuth, params, headers);

    return this.http.patch<any>(`${baseUrl}/${url}`, body, httpOptions)
        .pipe(catchError((error) => {
          throw /*CommonService*/this.handleError(error);
        }));
  }

  getAnySubject() {
    return this.anySubject;
  }

  getMesgSubject() {
    return this.gmessgSubject;
  }
  getBlockSubject() {
    return this.blockSubject;
  }

  getBlockSubjectAdmin() {
    return this.blockSubjectAdmin;
  }

  getViewsAccessRoles(destroy$: Subject<boolean>, result: any) {
    const tok = localStorage.getItem("access_token");
    const dtok = this.jwtHelper.decodeToken(tok!);
    if (!dtok) {
      return;
    }

    const roleIds = dtok.roleId;
    let isAdmin = false;
    if (!Array.isArray(dtok.roleId)) {
      isAdmin = parseInt(dtok.roleId, 10) === 1;
    } else {
      isAdmin = dtok.roleId.some((x: unknown) => x === '1' || x === 1);
    }
    let ris = [];

    if (!Array.isArray(roleIds)) {
      ris.push(parseInt(roleIds, 10));
    } else {
      ris = roleIds;
    }

    this.httpPost(`role/0/accessview`, ris, true)
        .pipe(takeUntil(destroy$)).subscribe(res => {
      const state: IaccessViewRole = {
        list: [],
        klinikId: dtok.klinikId,
        klinikLogo: dtok.klinikLogo,
        klinikName: dtok.klinikName,
        organLayan: dtok.OrganLayan,
        konfig: dtok.Konfig,
        isAdmin: isAdmin,
        sub: dtok.sub,
        name: dtok.name,
        production: environment.production,
        userId: dtok.userId
      };
      console.log(dtok);
      // if (dtok.nameid === '304') {    // TODO: altruise production Ucloud
      // if (dtok.nameid === '162') {    // local
      if (dtok.nameid === '0') {    // standar
        state.list = res;
      }
      result(state, dtok.roleId);
    }, error => {
      console.log(error);
    })
    // return this.httpService
    //     .post(`${environment.url}role/0/accessview`, ris)
    //     .map(res => res.json());
  }

  getDataChangedSubject() {
    return this.dataChgdSubject;
  }

  showMessage(severity: string, summary: string, detail: string): void {
    this.gmessgSubject.next(<GMessageState>{severity: severity, summary: summary,
      detail: detail.replace(/\n|\r\n|\r/g, '<br/>')});
  }

  confirm(param: ConfirmDialogMsg) {
    this.confirmDlgSubject.next(<IconfirmDialogState>{param: param});
  }

  private handleError(error: HttpErrorResponse) {
    let errMsg = 'Request Error';
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      // console.error('An error occurred:', error.error);
      errMsg = error.statusText ? error.statusText : errMsg;
      errMsg += error.message ? ' ' + error.message : '';
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      // console.error(error);
      // console.error(`Backend returned code ${error.status}, body was: `, error.error);
      errMsg = `Status ${error.status}`;
      // errMsg += error.statusText ? ' ' + error.statusText : '';
      // this.klinikPasienService.showError({statusText: 'Pasien belum dipilih'});
      if (error.error && typeof error.error === 'string') {
        errMsg += ' ' + error.error;
      } else if (error.error?.mesg) {
        errMsg += ' ' + error.error.mesg;
      } else if (error.message) {
        errMsg += ' ' + error.message;
      } else if (error.error && error.error.error && error.error.error.reason) {
        errMsg += ': ' + error.error.error.reason;
      } else if (error.statusText) {
        errMsg += ' ' + error.statusText;
      }
    }

    this.blockSubjectAdmin.next(false);
    this.showMessage('error', 'Error', errMsg);
    if (error.status === 401 || error.status === 404) {
      // && error.error?.tus?.url.endsWith('/auth')) {
      this.router.navigate(['auth/login']).then(() => {
        localStorage.removeItem("gib");
      });
    }

    // Return an observable with a user-facing error message.
    // return throwError('Something bad happened; please try again later.');
    return errMsg;
  }

  downloadFile(filePath: string) {
    let mimeType = 'application/pdf';
    let i = filePath.lastIndexOf('.');
    if (i >= 0) {
      mimeType = CommonService.mimeTypes[filePath.substring(i + 1)];
    }

    i = filePath.indexOf('|');
    if (i >= 0) {
      filePath = filePath.substring(i + 1);
    }

    const options = {
      params: new HttpParams().set('type', mimeType).set('fp', filePath),
      responseType: 'blob' as const
    };
    return this.http.get(environment.urlAdil + '/sfilup', options)
        .pipe(catchError((error) => {
          throw /*CommonService*/this.handleError(error);
        }));
  }

  openFile(filePath: string) {
    let mimeType = 'application/pdf';
    let i = filePath.lastIndexOf('.');
    if (i >= 0) {
      mimeType = CommonService.mimeTypes[filePath.substring(i + 1)];
    }

    i = filePath.indexOf('|');
    if (i >= 0) {
      filePath = filePath.substring(i + 1);
    }
    const url = environment.urlAdil + '/sfilup?type='
        + mimeType + '&fp=' + filePath;

    const wnd = window.open(url, '_blank');
    if (wnd) {
      wnd.focus();
    }
    /*
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        // Use the desired filename here
        a.download = 'fileName';
        a.target = '_blank';
        setTimeout(() => {
          a.click();
          // URL.revokeObjectURL(fileURL);
          // Remove the element to avoid clutter in DOM after download
          document.body.removeChild(a);
        });
    */
  }

  // extractData(res: string) {
  extractData(myBlob: Blob, fileName: string) {
    // transforme response to blob
    // const myBlob: Blob = new Blob([res], {type: 'application/pdf'});

    const fileURL = URL.createObjectURL(myBlob);
    const wnd = window.open(fileURL, '_blank');
    setTimeout(() => {
      if (wnd) {
        wnd.document.title = fileName;
      }
      URL.revokeObjectURL(fileURL);
    });

    /*
        var blob = new Blob([response], { type: 'application/pdf' });
        var url = URL.createObjectURL(blob);
    */
    /*
    http://localhost:8080/web_war_exploded/sfilup?type=application%2Fpdf&fp=fL2EK4cBBelXRrclg70B%2FGnjGb4cBqSpkRRk7z7m-%2Fmujair_2.pdf
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = fileURL;
        // Use the desired filename here
        a.download = fileName;
        a.target = '_top';
        setTimeout(() => {
          a.click();
          URL.revokeObjectURL(fileURL);
          // Remove the element to avoid clutter in DOM after download
          document.body.removeChild(a);
        });
    */
    /*
        const link = document.createElement('a');
        link.download = fileName;
        // let blob = new Blob(['Welcome to W3Docs'], {type: 'text/plain'});
        link.href = URL.createObjectURL(myBlob);
        link.rel = 'noreferrer noopener';
        link.target = '_blank';
        link.click();
        URL.revokeObjectURL(link.href);
    */
  }

  getFile(filePath: string): Observable<any> {
    return this.http.get<any>(filePath)
      .pipe(catchError((error) => {
        throw this.handleError(error);
      }));
  }
}
