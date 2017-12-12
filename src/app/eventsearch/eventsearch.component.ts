import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { Person } from '../Model/Person';

@Component({
  selector: 'app-eventsearch',
  templateUrl: './eventsearch.component.html',
  styleUrls: ['./eventsearch.component.css']
})
export class EventsearchComponent implements OnInit {
  message: string;
  PeopleList : Person[] = [];
  SelectedPerson : Person;
  
  CategoryList = [];
  EventDataList = [];
  pagedItems: any[];

  currentPage = 0;
  pageSize = 10;
  numberOfPages=2;

  selectedEvent: any;
  selectedCategory: any;
  closeResult: string;
  
  constructor(private _dataService:DataService, private modalService: NgbModal) { }

  ngOnInit() {

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
      this.numberOfPages = Math.round(this.EventDataList.length / this.pageSize);
      this.setPage();
    });

    this._dataService.getCategories()
    .subscribe(res => {
      this.CategoryList = res;
      console.log("CategoryList=",this.CategoryList);
    });


  }

  onChangeName(person : Person) {
    console.log("person=",person);
    alert(person);
  }

  onChange(Category) {
    console.log("Category=",Category);
    alert(Category);
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

  toJSONLocal (date) {
	  var local = new Date(date);
    //local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
  }
  


  //https://ng-bootstrap.github.io/#/components/modal/examples
  open(content, event) {
    // console.log("open(person)=",person);
  if (event.Date!=null)
  event.Date = this.toJSONLocal(event.Date);

    this.message = "here is the select id = " + event._id;
    this.selectedEvent=event;
    this.selectedCategory=event.Category;

    //console.log("open(selectedAddress)=",this.selectedAddress);
      


    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result=="Saving") {
        console.log("Save(event)=",this.selectedEvent);
        this.Save();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  Save() {
    this._dataService.saveEvent(this.selectedEvent)
    .subscribe(res => {
      console.log("Save res =",res);
      this.message = res.data.status;
    },
    err => {
      console.log("Error from Save", err)
    });
  
  }
  
}
