import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Address } from '../Model/Address';
import { Person } from '../Model/Person';
import { Event } from '../Model/Event';
import  * as _ from 'lodash';


@Component({
  selector: 'app-personsearch',
  templateUrl: './personsearch.component.html',
  styleUrls: ['./personsearch.component.css']
})
export class PersonsearchComponent implements OnInit {
  isBusy = true;
  message = "People List Message";
  PeopleDataList : Person[] = [];
  AddressList : Address[] = [];
  pagedItems: Person[] = [];
  selectedPerson: Person;
  selectedAddress: Address;
  errorMessage = "";

  currentPage = 0;
  pageSize = 10;
  numberOfPages=2;
  closeResult: string;
  isAdmin=true;
  
  constructor(private _dataService:DataService, private modalService: NgbModal) { }

  ngOnInit() {
    this._dataService.getUsers()
    .subscribe(res => {
      this.PeopleDataList = res;
      console.log("peoplelist=",this.PeopleDataList);
      this.numberOfPages = Math.round(this.PeopleDataList.length / this.pageSize);
      this.setPage();
    });

    let storedList:string = localStorage.getItem("AddressList");
    if (storedList==null) {
      this._dataService.getAddresses()
      .subscribe(res => {
        this.AddressList = res;
        console.log("AddressList=",this.AddressList);
        localStorage.setItem("AddressList", JSON.stringify(this.AddressList));
      });
    }
    else {
      this.AddressList = JSON.parse(storedList);
      console.log("inflated AddressList=",this.AddressList);
    }
  }

  CreateNew(content) {
    let p = new Person();

    open(content, JSON.stringify(p));
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

    console.log("peoplelist len=",this.PeopleDataList.length, "  currpage=", this.currentPage, "   pagesize=", this.pageSize);
    this.pagedItems = this.PeopleDataList.slice(this.currentPage*this.pageSize, this.currentPage*this.pageSize + this.pageSize);
    console.log("this.pagedItems=",this.pagedItems);
  }

  onChange(Address) {
    console.log("onchange Address=",Address);
    console.log("onchange this.selectedAddress=",this.selectedAddress);
    this.selectedPerson.AddressID=this.selectedAddress._id;
    
  }

 toJSONLocal (date) {
	  var local = new Date(date);
    //local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
  }
  
//https://ng-bootstrap.github.io/#/components/modal/examples
  open(content, person) {
    console.log("open(person)=",person);
    if (person==null) {
      person = new Person();
      console.log("open(new person)=",person);
		this.selectedPerson=person;
		this.selectedAddress = new Address();
	}
	else
	{
    if (person.events[0].Date!=null)
      person.events[0].Date = this.toJSONLocal(person.events[0].Date);

		this.message = "here is the select id = " + person._id;
    this.selectedPerson=person;
    
		if (this.selectedPerson["Address ID"]==null)
			this.selectedAddress = new Address();
		else {
			console.log("this.selectedPerson.AddressID=",this.selectedPerson["Address ID"]);
			//this.selectedAddress = _.find(this.AddressList, {id :this.selectedPerson["Address ID"]});
      this.selectedAddress = <Address> _.find(this.AddressList, { _id :this.selectedPerson["Address ID"]});
		}

		console.log("open(selectedAddress)=",this.selectedAddress);
	}


    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result=="Saving")
        console.log("Save(person)=",this.selectedPerson);
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


}
