import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Subject, Observable, ObservableInput, throwError, BehaviorSubject, from, of } from 'rxjs';

import { AuthService } from './auth.service'
import { catchError, switchMap } from 'rxjs/operators';
import { DataService, Nullable } from './data.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: Subject<any> = new BehaviorSubject<any>(null);

//    constructor(private auth: AuthService) {}
  constructor(private _authService: AuthService, private _dataService: DataService) {}


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('intercept start request req.url:', req.url);
    if (req.url.indexOf('refresh') !== -1) {
      return next.handle(req);
    }

    // Get the auth token from the service.
    //const authToken = this.auth.getAuthorizationToken();
    let currTokenVal: Nullable<string> = this._authService.getToken();
    console.log('intercept start request verb:', req.method);
    //if (req.method === "GET") return next.handle(req);

    console.log("intercept start tok", currTokenVal);
    //Must have a access_Token expired or not to use refresh
    if (currTokenVal !== null) {
      const authToken: string = 'Bearer ' + currTokenVal;

      /*
      * The verbose way:
      // Clone the request and replace the original headers with
      // cloned headers, updated with the authorization.
      const authReq = req.clone({
        headers: req.headers.set('Authorization', authToken)
      });
      */
      // Clone the request and set the new header in one step.
      const authReq = req.clone({ setHeaders: { Authorization: authToken } });

      // send cloned request with header to the next handler.
      return next.handle(authReq).pipe(catchError(err => {
        console.log('catchError err', err);
        //if the error was other than unauthorized, throw
        if (err.status !== 401 && err.status !== 403) {
          console.log('interceptor catchError error not 401 nor 403');
          return next.handle(req);//don't throw allow caller to handle ==>throwError(err);
        }

        console.log('interceptor start refreshTokenInProgress:', this.refreshTokenInProgress);
        //start refreshtoken
        if (!this.refreshTokenInProgress) {
          this.refreshTokenInProgress = true;
          this.refreshTokenSubject.next(null);
          //          return this.ProcessRefreshToken(req, next);

          let rfreshtok: Nullable<string> = this._authService.getRefreshToken();
          return this._dataService.getRefreshToken(rfreshtok).pipe(
            switchMap((value: any, index: number) => {
              this._authService.setAuthToken(value.tok);
              console.log("ProcessRefreshToken tok from refresh", value.tok);
              const authToken: string = 'Bearer ' + value.tok;
              // Clone the request and set the new header in one step.
              const authReq = req.clone({ setHeaders: { Authorization: authToken } });

              this.refreshTokenInProgress = false;
              this.refreshTokenSubject.next(value.tok);

              return next.handle(authReq);
              //return value;
            }),
            catchError((e) => {
              // handle e and return a safe value or re-throw
              console.log("ProcessRefreshToken switchmap1  catchError error", e);
              //                return throwError(e);
              this.refreshTokenInProgress = false;
              return next.handle(req);
            })
          );
        }
        return next.handle(req);//don't throw allow caller to handle ==>throwError(err);
       }));

    }
    else {
      return next.handle(req);
    }
  }

  injectToken(request: HttpRequest<any>) {
    const token = this._authService.getToken();
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
