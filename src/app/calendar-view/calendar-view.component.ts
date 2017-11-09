import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { NgSwitchCase } from '@angular/common';
//import {CalendarComponent} from "ap-angular2-fullcalendar/src/calendar/calendar";
import { DataService } from '../data.service';
import { MyEvent, colors } from '../Model/MyEvent';
import { CalendarEvent } from 'angular-calendar';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

//https://www.npmjs.com/package/angular-calendar
//https://mattlewis92.github.io/angular-calendar/#/kitchen-sink
//https://www.npmjs.com/package/angular2-fullcalendar
//'../../../node_modules/fullcalendar/dist/fullcalendar.min.css'
@Component({
  selector: 'app-calendar-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {
  view: string = 'month';
  viewDate: Date;
  refresh: Subject<any> = new Subject();
  
    //events: Array<CalendarEvent<{ incrementsBadgeTotal: boolean }>> = 
  events: any[];
  activeDayIsOpen: boolean = false;
  

  constructor(private _dataService:DataService) { }

  ngOnInit() {
    //this.events=[];
    //this.events.push(new MyEvent('first event', colors.blue,new Date()))
    //this.events.push(new MyEvent('second', colors.blue,new Date()))
    this.getEvents();
  }

  getEvents(): void {
    //this.events = [];
    this.viewDate = new Date();
    var firstDay = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
    var lastDay = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0);
    console.log("firstDay=", firstDay);
    console.log("lastDay=", lastDay);
   
        this._dataService.geCalendarEvents(firstDay, lastDay)
          .then(res => { 
            console.log("result geteents",res);
            this.events = res;
 /*           res.map(o => {
                var dt = new Date(o.start);//Date);
                dt.setFullYear(new Date().getFullYear());
                return new MyEvent(o.title, colors.blue, dt);// { title: o.title, color: colors.blue, start: dt };
              }).forEach(item => this.events.push(item));
          
              //this.events=this.events.slice(0,16);
              console.log("about to Refresh events", this.events);
*/              
              setInterval(() => {
                this.activeDayIsOpen = true;

   //                    this.refresh.next();
              }, 1000);    
              
    
            })
            //this.refresh.next();
  }


  dayClicked({ date, events}: { date: Date; events: MyEvent[]}): void {
      //if (isSameMonth(date, this.viewDate)) {
        //if (
          //(isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
          //events.length === 0
        //) {
//          this.activeDayIsOpen = false;
  //      } else {
          this.activeDayIsOpen = true;
          this.viewDate = date;
         // console.log("dayclicked viewDate=" + this.viewDate);
          //    }
    //  }
    }


    handleEvent(action: string, event: Date): void {
//      console.log(action);
      console.log("event=" + event);
      console.log("viewDate=" + this.viewDate);

      this.viewDate=event;      
//      var firstDay = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
//      var lastDay = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0);
//      console.log("firstDay=" + firstDay);
//      console.log("lastDay=" + lastDay);
      this.getEvents();
      
      //this.modalData = { event, action };
      //this.modal.open(this.modalContent, { size: 'lg' });
    }
  

}
