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
  Descrip: string;
  PeopleList : Person[] = [];
  SelectedPerson : Person;
  
  CategoryList = [];
  EventDataList = [];
  pagedItems: any[];

  currentPage = 0;
  pageSize = 10;
  numberOfPages=2;

  selectedEvent: any;
  selectedCategory: string;
  closeResult: string;
  
  fromDate: string;
  toDate: string;

  constructor(private _dataService:DataService, private modalService: NgbModal) { }

  ngOnInit() {

    this._dataService.getUsers()
    .subscribe(res => {
      var p = new Person();
      p._id=0;
      p.Name="** Choose Person **";
      res.unshift(p)
      this.SelectedPerson=p;

      this.PeopleList = res;
      console.log("peoplelist=",this.PeopleList);
    },
    err => {
      console.log("Error from getUsers", err)
    });

    this.getEvents();

    

    this._dataService.getCategories()
    .subscribe(res => {
      this.CategoryList = res;
      //console.log("CategoryList=",this.CategoryList);
    });


  }

  filter(){
    this.getEvents();
  }

  getEvents(){
    this.pagedItems = [];
    this.currentPage=0;
    this.numberOfPages=0;

    console.log("this.SelectedPerson",this.SelectedPerson, "fromDate", this.fromDate, "toDate", this.toDate, "selectedCategory", this.selectedCategory, "Descrip", this.Descrip);

    let id=0;
    if (this.SelectedPerson!=null)
      id = this.SelectedPerson._id;

      if (this.Descrip!=null && this.Descrip.trim().length==0) this.Descrip=null;
      if (this.fromDate!=null && this.fromDate.trim().length==0) this.fromDate=null;
      if (this.toDate!=null && this.toDate.trim().length==0) this.toDate=null;
      

    this._dataService.getEvents(id, this.fromDate, this.toDate, this.selectedCategory, this.Descrip)
    .subscribe(res => {
      this.EventDataList = res;
      console.log("EventDataList=",this.EventDataList);
      if (this.EventDataList.length>0 && this.EventDataList.length < this.pageSize)
        this.numberOfPages = 1;
      else
        this.numberOfPages = Math.round(this.EventDataList.length / this.pageSize);
      this.setPage();
    });    
  }

  onChangeName(person : Person) {
    console.log("person=",person);
    this.SelectedPerson=person;
    this.getEvents();
  }

  onChange(Category) {
    console.log("Category=",Category);
    this.selectedCategory=Category;
    this.getEvents();
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
