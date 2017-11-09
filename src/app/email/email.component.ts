import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { Person } from '../Model/Person';
import { Event } from '../Model/Event';
import  * as _ from 'lodash';


//http://plnkr.co/edit/WHzjIQqbg7SrneAIR2wS?p=preview
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
 // @ViewChild('cboPeople') selectElRef;
 // @ViewChild('cboSELPeople') selectSELElRef;
  PeopleList : Person[] = [];
  UnSelectedEmailList : Person[] = [];
  SelectedEmailList : Person[] = [];
  SelectedEmailIDList : number[] = [];
  SelectedEvent : Event;
  EventDataList : Event[] = [];
  message = "";
  

  constructor(private _dataService:DataService) { }

  ngOnInit() {

   this.message= "SelectedEmailIDList len=" + this.SelectedEmailIDList.length;
    this._dataService.getUsers()
    .subscribe(res => {
      this.PeopleList = res;
      console.log("peoplelist=",this.PeopleList);
    },
    err => {
      console.log("Error from getUsers", err)
    });
	
    this._dataService.getEvents()
    .subscribe(res => {
      this.EventDataList = res;
      console.log("EventDataList=",this.EventDataList);
    },
    err => {
      console.log("Error from getevents", err)
    });
	
}

UpdateLists() {

  console.log("UpdateLists this.SelectedEmailIDList=", this.SelectedEmailIDList);
  
  if (this.SelectedEmailIDList==null || (this.SelectedEmailIDList!=null && this.SelectedEmailIDList.length==0)) {
    this.UnSelectedEmailList=this.PeopleList;
  }
  else {
     let currList = this.SelectedEmailIDList;
      this.SelectedEmailList = <Person[]> _.reduce(this.PeopleList, function(memo, val, idx) {
        //console.log("SEL val.id", val._id);
        //console.log("SEL  this.SelectedEmailIDList=", currList);
        if (_.includes(currList, val._id)) {
          //console.log("SEL FOUND val.id", val._id);
          memo.push(val);
        }
        return memo;
      }, []);
      this.UnSelectedEmailList = <Person[]> _.reduce(this.PeopleList, function(memo, val, idx) {
        //console.log("UNSEL val.id", val._id);
        if (!_.includes(currList, val._id)) {
          //console.log("UNSEL FOUND val.id", val._id);
          memo.push(val);
        }
        return memo;
      }, []);

      /*
      let options = this.selectElRef.nativeElement.options;
      for(let i=0; i < options.length; i++) {
        if (_.includes(currList, options[i].value)) {
            options[i].selected = true;
        }
        else
          options[i].selected = false;
      }
      */

  }
} 

onChange(evnt) {
  //  console.log("onchange evnt=",this.SelectedEvent.Emails);
	this.SelectedEmailIDList = this.SelectedEvent.Emails;
  //  console.log("onchange SelectedEmailIDList=",this.SelectedEmailIDList);
	this.UpdateLists();
    
  }

changeSEL(options) {
  console.log("change cboSELPeople options=", options);
  var hldSel = [];
  Array.apply(null,options)  // convert to real Array
    .filter(option => option.selected)
    .map(option => {     /*console.log("option=", option.value);*/ hldSel.push(parseInt(option.value)); return  parseInt(option.value) });

    //console.log("change cboSELPeople hldSel=", hldSel);
    
    _.remove(this.SelectedEmailIDList, function (selVal) {
    return _.includes(hldSel, selVal);
  });
  //console.log("change this.SelectedEmailIDList=", this.SelectedEmailIDList);
  
}

change(options) {
  console.log("change cboPeople options=", options);
  var hldSel = Array.apply(null,options)  // convert to real Array
    .filter(option => option.selected)
    .map(option => {     /*console.log("option=", option);*/ this.SelectedEmailIDList.push(parseInt(option.value)); return  parseInt(option.value) });
    //console.log("change this.SelectedEmailIDList=", this.SelectedEmailIDList);
    
    

}

UpdateSelection() {
  this.UpdateLists();
}

Save() {
  this._dataService.saveEmails(this.SelectedEvent)
  .subscribe(res => {
    console.log("Save res =",res);
    this.message = res.data.status;
  },
  err => {
    console.log("Error from getUsers", err)
  });

}

}
