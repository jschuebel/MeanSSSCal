import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { MyEvent, colors } from './MyEvent';

@Injectable()
export class DataService {
	result:any;

  constructor(private _http: Http) { }

  
  getUsers() {
    return this._http.get("/api/users")
      .map(result=>this.result=result.json().data);
    }

  geEvents(start:Date, end:Date) {
/*
    var my : MyEvent[] = [
      {
       title: 'Increments badge total on the day cell2',
       color: colors.yellow,
       start: new Date()//,
     },
     {
       title: 'Does not increment the badge total on the day cell2',
       color: colors.blue,
       start: new Date()//,
     }
   ];
return my;
*/
      return this._http.get("/api/GetCalendarEvents?&start="+start+"&end="+end)
      .map(result=>this.result=result.json());
//      .map(result=>this.result=result.json().data);
    }



    }
