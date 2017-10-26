import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-eventsearch',
  templateUrl: './eventsearch.component.html',
  styleUrls: ['./eventsearch.component.css']
})
export class EventsearchComponent implements OnInit {
  message = "People List Message";
  EventDataList = [];
  pagedItems: any[];
  errorMessage = "";

  currentPage = 0;
  pageSize = 10;
  numberOfPages=2;
  
  constructor(private _dataService:DataService, private modalService: NgbModal) { }

  ngOnInit() {
    this._dataService.getEvents()
    .subscribe(res => {
      this.EventDataList = res;
      console.log("EventDataList=",this.EventDataList);
      this.numberOfPages = Math.round(this.EventDataList.length / this.pageSize);
      this.setPage();
    });
  }

  setPage() {
    if (this.currentPage < 0) {
      this.currentPage=0;
      return;
    }
    if (this.currentPage > this.numberOfPages-1) {
      this.currentPage=this.numberOfPages-1;
      return;
    }

    console.log("peoplelist len=",this.EventDataList.length, "  currpage=", this.currentPage, "   pagesize=", this.pageSize);
    this.pagedItems = this.EventDataList.slice(this.currentPage*this.pageSize, this.currentPage*this.pageSize + this.pageSize);
    console.log("this.pagedItems=",this.pagedItems);
  }



}
