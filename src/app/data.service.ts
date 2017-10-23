import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { MyEvent, colors } from './MyEvent';

@Injectable()
export class DataService {
	result:any;
	result2:any;
  
  constructor(private _http: Http) { }

  
  getUsers() {
    return this._http.get("/api/users")
    .map(result=>this.result=result.json());
//    .map(result=>this.result=result.json().data);
  }

  getEvents() {
    return this._http.get("/api/events")
    .map(result=>this.result=result.json().data);
  }

  geCalendarEvents(start:Date, end:Date) {
      return this._http.get("/api/GetCalendarEvents?&start="+start+"&end="+end)
      .map(result=>result.json())
      .map(items => { items.forEach(element => {
            element.start = new Date(element.start);
            element.color= colors.blue;
            element.start.setFullYear(new Date().getFullYear()); }) 
          return items; })
      .toPromise();
    }



    }
