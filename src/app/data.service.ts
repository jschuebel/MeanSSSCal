import { Injectable } from '@angular/core';
/*
import { Http, Headers, RequestOptions } from '@angular/http';
import {
  HttpClient, HttpEvent, HttpEventType, HttpProgressEvent,
  HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
*/
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

//import 'rxjs/add/operator/map';
import {map} from 'rxjs/operators'
import { MyEvent, colors } from './Model/MyEvent';
import { Address } from './Model/Address';
import { SSSEvent } from './Model/SSSEvent';
import { Person } from './Model/Person';
//import { userInfo } from 'os';

export type Nullable<T> = T | null;

@Injectable()
export class DataService {
	result:any;
	result2:any;
  
  constructor(private _http: HttpClient) { }

  login(person : Person ) {
    var hldperson = JSON.parse(JSON.stringify(person));
    return this._http.post<any>("/api/login",{person:person});
     //.map(result=>this.result=result.json().data);
  }

  
  //https://blog.angularindepth.com/the-new-angular-httpclient-api-9e5c85fe3361
  //https://angular.io/guide/http  
  loggeduser() {
    /* Manual addition of header ****
    let currTokenVal:string = localStorage.getItem("currToken");

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + currTokenVal
      })
      };
    return this._http.post<any>("/api/test", {}, httpOptions);
      */
     return this._http.post<any>("/api/loggeduser", {});
    

    /* pre-v7.0
    var headers = new Headers();
    let currTokenVal:string = localStorage.getItem("currToken");

    headers.append('Authorization', 'Bearer ' + currTokenVal);
    headers.append('Content-Type', 'application/json');

    return this._http2.post("/api/test",{})
     .map(result=>this.result=result.json().data);
    */
     }

     getRefreshToken(tok:Nullable<string>) {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + tok
        })
      };
      return this._http.post<any>("/api/refreshtoken", {}, httpOptions);
//      return this._http.post<any>("http://sso.schuebelsoftware.com/api/refreshtoken", {}, httpOptions);
    }
  
    logout() {
      return this._http.post<any>(`/api/logout`, {});
//      return this._http.post<any>(`http://sso.schuebelsoftware.com/api/logout`, {});
      
    }
  saveEmails(event : SSSEvent ) {
    return this._http.post<any>("/api/eventemail",{ id:event._id, Emails: event.Emails});
    //.map(result=>this.result=result.json().data);
  }

  
  savePerson(person : Person ) {
    var hldperson = JSON.parse(JSON.stringify(person));
    return this._http.post<any>("/api/user",{ person: person});//.map(result=>this.result=result.json().data);
  }

  getUsers() {
    return this._http.get<Array<Person>>("/api/users");
  }

  saveEvent(event : SSSEvent ) {
    //deep clone and remove the extra information
    var hldevent = JSON.parse(JSON.stringify(event));
    delete hldevent.eventperson;
     return this._http.post<any>("/api/event",{ event: hldevent});
//      .map(result=>this.result=result.json().data);
}

  getEvents(UserID:Nullable<number>, fromDate: Nullable<string>, toDate: Nullable<string>, cat: Nullable<string>, descrip : Nullable<string>) {
    //Restful : "/api/events/"+ UserID
    console.log("getEvents  UserId=", UserID, "  fromDate=", fromDate, "  toDate=", toDate, "  cat=", cat, "  descrip=", descrip);
    var rout="/api/events";
    if (UserID!==null && UserID!=0)
      rout+="?userid="+UserID;

    if (fromDate!=null) {
      if (rout.indexOf("?")==-1)  rout+="?"
      rout+="&fromdate="+fromDate;
    }

    if (toDate!=null) {
      if (rout.indexOf("?")==-1)  rout+="?"
      rout+="&todate="+toDate;
    }

    if (cat!=null) {
      if (rout.indexOf("?")==-1)  rout+="?"
      rout+="&cat="+cat;
    }

    if (descrip!=null) {
      if (rout.indexOf("?")==-1)  rout+="?"
      rout+="&descrip="+descrip;
    }


    console.log("getEvents rout=", rout,);
      
      return this._http.get<Array<SSSEvent>>(rout);
  }

  
  getPictures()  {
    //force result to string
      return this._http.get("./inetpub.json", {responseType: 'text'});
  }
  
  getAddresses() {
    return this._http.get<any>("/api/addresses");
  }
  
  getCategories()   {
    return this._http.get<any>("/api/categories");//.map(result=>this.result=result.json().data);
  }

  getCalendarEvents(start:Date, end:Date):Observable<any> {
    console.log("getCalendarEvents start=", start, ' end=', end);
    return this._http.get<Array<any>>("/api/GetCalendarEvents?&start="+start+"&end="+end);
    
    /*
    return this._http2.get("/api/GetCalendarEvents?&start="+start+"&end="+end)
      .map(result=>result.json())
      .map(items => { items.forEach(element => {
        element.start=element.start.replace("T00","T06");
        element.start = new Date(element.start);
        element.color= colors.blue;
        element.start.setFullYear(start.getFullYear()); 
            }) 
            return items; 
          });
      */
    }



    }
