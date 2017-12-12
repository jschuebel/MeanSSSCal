import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { MyEvent, colors } from './Model/MyEvent';
import { Event } from './Model/Event';
import { Person } from './Model/Person';

@Injectable()
export class DataService {
	result:any;
	result2:any;
  
  constructor(private _http: Http) { }

  
  saveEmails(event : Event ) {
    return this._http.post("/api/eventemail",{ id:event._id, Emails: event.Emails})
    .map(result=>this.result=result.json());
//    .map(result=>this.result=result.json().data);
  }

  
  savePerson(person : Person ) {
    var hldperson = JSON.parse(JSON.stringify(person));
    return this._http.post("/api/user",{ person: person})
    .map(result=>this.result=result.json().data);
  }

  getUsers() {
    return this._http.get("/api/users")
    .map(result=>this.result=result.json());
  }

  saveEvent(event : Event ) {
    //deep clone and remove the extra information
    var hldevent = JSON.parse(JSON.stringify(event));
    delete hldevent.eventperson;
     return this._http.post("/api/event",{ event: hldevent})
    .map(result=>this.result=result.json());
  }

  getEvents() {
    return this._http.get("/api/events")
    .map(result=>this.result=result.json());
  }

  getAddresses() {
    return this._http.get("/api/addresses")
    .map(result=>this.result=result.json().data);
  }
  
  getCategories() {
    return this._http.get("/api/categories")
    .map(result=>this.result=result.json().data);
  }

  getCalendarEvents(start:Date, end:Date) {
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
