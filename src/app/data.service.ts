import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { MyEvent, colors } from './Model/MyEvent';
import { Event } from './Model/Event';
import { Person } from './Model/Person';
//import { userInfo } from 'os';

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

  getEvents(UserID:number, fromDate: string, toDate: string, cat: string, descrip : string) {
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
      
      return this._http.get(rout)
    .map(result=>this.result=result.json());
  }
  getPictures() {
    return this._http.get("./Inetpub.json");
    
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
        element.start=element.start.replace("T00","T06");
        element.start = new Date(element.start);
        element.color= colors.blue;
        element.start.setFullYear(start.getFullYear()); 
            }) 
            return items; 
          })
      .toPromise();
    }



    }
