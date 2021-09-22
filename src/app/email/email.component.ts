import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service'
import { Person } from '../Model/Person';
import { SSSEvent } from '../Model/SSSEvent';
import  * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';


//http://plnkr.co/edit/WHzjIQqbg7SrneAIR2wS?p=preview
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  @ViewChild('cboPeople') selectElRef: ElementRef;
  @ViewChild('cboSELPeople') selectSELElRef: ElementRef;
  private subscription: Subscription;
  PeopleList : Person[] = [];
  UnSelectedEmailList : Person[] = [];
  SelectedEmailList : Person[] = [];
  SelectedEmailIDList : number[] = [];
  SelectedEvent : SSSEvent;
  EventDataList : SSSEvent[] = [];
  message = "";
  isLoggedIn = false;
 

  constructor(private _dataService:DataService,
              private _authService:AuthService) { }

  ngOnInit() {
    this.subscription = this._authService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option')) {
//        console.log(res.option);
        // perform your other action from here
        this.isLoggedIn = this._authService.isAuthenticated();
  
      }
    });
    this.isLoggedIn = this._authService.isAuthenticated();
  
  // this.message= "SelectedEmailIDList len=" + this.SelectedEmailIDList.length;
    this._dataService.getUsers()
    .subscribe(res => {
      this.PeopleList = res;
      console.log("peoplelist=",this.PeopleList);
    },
    err => {
      console.log("Error from getUsers", err)
    });
	
    this._dataService.getEvents(null,null,null,null,null)
    .subscribe(res => {
      var evt = new SSSEvent();
      evt._id=-1;
      evt.DisplayOnly="** Choose Event **";
      evt.Date = new Date();
      res.unshift(evt)
      this.SelectedEvent=evt;
     
      res.forEach(item => {
//        console.log("item.Description", item.Description, "  Date", item.Date);
        var len =0;
        var newstring="";
        if  (item.Description==null || (item.Description!=null && item.Description.trim().length==0)) {
          newstring=(item.Topic==null?"N/A":item.eventperson[0].Name + " " + item.Topic.replace(/[\n\t]/g,'    ')).trim();
          len = newstring.length;
        }
        else {
          newstring=item.Description.replace(/[\n\t]/g,'    ').substring(0,25).trim();
          len = newstring.length;
        }
        len = (len>25)?25:len;
        var padd = new Array(27-len)
        var padds = padd.join("&nbsp;");
        if (item._id!=-1)
          item.DisplayOnly =  newstring.replace(/ /g,'&nbsp;') + padds + (item.Date==null?"N/A":this.toJSONLocal(item.Date));
        console.log("item.DisplayOnly", item.DisplayOnly,"len", len);
      });

      this.EventDataList= _.orderBy(res, [evt => evt.DisplayOnly], ['asc']);
      
      console.log("EventDataList=",this.EventDataList);
    },
    err => {
      console.log("Error from getevents", err)
    });
	
}

toJSONLocal (date:Date) {
  var locl = new Date(date);
  //local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  console.log("toJSONLocal local.toUTCString()=",locl.toJSON());
  return locl.toJSON().slice(0, 10);
}

UpdateLists() {

  console.log("UpdateLists this.SelectedEmailIDList=", this.SelectedEmailIDList);
  
  this.UnSelectedEmailList  = [];
  this.SelectedEmailList  = [];
  if (this.SelectedEmailIDList==null || (this.SelectedEmailIDList!=null && this.SelectedEmailIDList.length==0)) {
    this.UnSelectedEmailList=this.PeopleList;
  }
  else {
     let currList = this.SelectedEmailIDList;
      this.SelectedEmailList = <Person[]> _.reduce(this.PeopleList, function(memo:any, val:any, idx:any) {
        //console.log("SEL val.id", val._id);
        //console.log("SEL  this.SelectedEmailIDList=", currList);
        if (_.includes(currList, val._id)) {
          //console.log("SEL FOUND val.id", val._id);
          memo.push(val);
        }
        return memo;
      }, []);
      this.UnSelectedEmailList = <Person[]> _.reduce(this.PeopleList, function(memo:any, val:any, idx:any) {
        //console.log("UNSEL val.id", val._id);
        if (!_.includes(currList, val._id)) {
          //console.log("UNSEL FOUND val.id", val._id);
          memo.push(val);
        }
        return memo;
      }, []);
  }
} 

onChange(evnt:SSSEvent) {
  //  console.log("onchange evnt=",this.SelectedEvent.Emails);
	this.SelectedEmailIDList = this.SelectedEvent.Emails;
  //  console.log("onchange SelectedEmailIDList=",this.SelectedEmailIDList);
	this.UpdateLists();
    
  }

/* this get added to select==> (change)="changeSEL($event.target.options)"
changeSEL(options) {
  console.log("change cboSELPeople options=", options);
  var hldSel = [];
  Array.apply(null,options)  // convert to real Array
    .filter(option => option.selected)
    .map(option => {  hldSel.push(parseInt(option.value)); return  parseInt(option.value) });

    //console.log("change cboSELPeople hldSel=", hldSel);
    
    _.remove(this.SelectedEmailIDList, function (selVal) {
    return _.includes(hldSel, selVal);
  });
  //console.log("change this.SelectedEmailIDList=", this.SelectedEmailIDList);
  
}
*/

/* this get added to select==> (change)="change($event.target.options)"
change(options) {
  console.log("change cboPeople options=", options);
  var hldSel = Array.apply(null,options)  // convert to real Array
    .filter(option => option.selected)
    .map(option => {     console.log("option=", option); this.SelectedEmailIDList.push(parseInt(option.value)); return  parseInt(option.value) });
    console.log("change this.SelectedEmailIDList=", this.SelectedEmailIDList);
  
}
*/

Move2Pople() {
  //console.log("Move2Pople");
  let options = this.selectSELElRef.nativeElement.options;
  for(let i=0; i < options.length; i++) {
    if (options[i].selected) {
      console.log("REF selectSELElRef option=", options[i]);
        _.remove(this.SelectedEmailIDList, function (selVal) {
        return (parseInt(options[i].value) == selVal);
      });
    }
  }
  console.log("Move2Pople this.SelectedEmailIDList=", this.SelectedEmailIDList);
  this.UpdateLists();  
}

Move2SELPople() {
  //console.log("Move2SELPople");
  let options = this.selectElRef.nativeElement.options;
  //console.log("options.length=", options.length);
  for(let i=0; i < options.length; i++) {
    if (options[i].selected) {
      console.log("REF selectElRef option=", options[i]);
      this.SelectedEmailIDList.push(parseInt(options[i].value));
    }
  }
  console.log("Move2SELPople this.SelectedEmailIDList=", this.SelectedEmailIDList);
  this.UpdateLists();  
}


/*}
UpdateSelection() {
  this.UpdateLists();
}
*/

Save() {
   this._dataService.saveEmails(this.SelectedEvent)
  .subscribe(res => {
    console.log("Save res =",res);
    this.message = res.data.status;
  },
  err => {
    console.log("Error from getUsers", err)
    if (err.status===403)
    this.message = "Event Access: " + err.statusText;
});

}

}
