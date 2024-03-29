import { Component, OnInit } from '@angular/core';
import { DataService, Nullable } from '../data.service';
import { AuthService } from '../auth.service'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Address } from '../Model/Address';
import { Person } from '../Model/Person';
import { SSSEvent } from '../Model/SSSEvent';
import  * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';



@Component({
  selector: 'app-personsearch',
  templateUrl: './personsearch.component.html',
  styleUrls: ['./personsearch.component.css']
})
export class PersonsearchComponent implements OnInit {
  private subscription: Subscription;
  isBusy = true;
  isLoggedIn = false;
  message: string;
  MasterPeopleDataList : Person[] = [];
  PeopleDataList : Person[] = [];
  AddressList : Address[] = [];
  pagedItems: Person[] = [];
  selectedPerson: Person;
  selectedAddress: Address;
  
  sortColumn: string = 'Name';
 
  currentPage = 0;
  pageSize = 10;
  numberOfPages=2;
  closeResult: string;
  
  constructor(private _dataService:DataService,
            private _authService:AuthService,
            private modalService: NgbModal) { }

  ngOnInit() {
    this.subscription = this._authService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option')) {
//        console.log(res.option);
        // perform your other action from here
        this.isLoggedIn = this._authService.isAuthenticated();
  
      }
    });

    this.isLoggedIn = this._authService.isAuthenticated();
    console.log("isLoggedIn=",this.isLoggedIn);
 
    this._dataService.getUsers()
    .subscribe(res => {

      this.MasterPeopleDataList = <Person[]> _.map(res, function(val:Person) {
        if (val.events[0]==null) {
          return val;
        }
        let dt = new Date(val.events[0].Date);
        //console.log(new Date(dt.getTime() + (dt.getTimezoneOffset() * 60000)));
        val.events[0].Date=new Date(dt.getTime() + (dt.getTimezoneOffset() * 60000));
        return val;
      });
    
      console.log("peoplelist=",this.MasterPeopleDataList);
      this.numberOfPages = Math.round(this.MasterPeopleDataList.length / this.pageSize);
      this.PeopleDataList=this.MasterPeopleDataList;
      this.setPage();
    });

    let storedList:Nullable<string> = localStorage.getItem("AddressList");
    if (storedList==null) {
      this._dataService.getAddresses()
      .subscribe(res => {
        this.AddressList = res.data;
        console.log("AddressList=",this.AddressList);
        localStorage.setItem("AddressList", JSON.stringify(this.AddressList));
      });
    }
    else {
      this.AddressList = JSON.parse(storedList);
      console.log("inflated AddressList=",this.AddressList);
    }
  }

  CreateNew(content:any) {
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

  onChange(Address:Address) {
    console.log("onchange Address=",Address);
    console.log("onchange this.selectedAddress=",this.selectedAddress);
    this.selectedPerson.AddressID=this.selectedAddress._id;
    
  }

filter(data:any){
  let col="Name";
  console.log("filter event=",data);
  
  this.PeopleDataList=this.MasterPeopleDataList;
  this.PeopleDataList = <Person[]> _.reduce(this.PeopleDataList, function(memo:any, val:any, idx:any) {
    let bracketPos=data.col.indexOf("[");

    if (val!=null && val[data.col]!=null) {
    
      /*
    console.log("filter bracketPos", bracketPos);
    var newval="";
    var nbrk = "";
    if (bracketPos!=-1) {
      newval=data.col.substr(0,bracketPos);
      nbrk=data.col.substr(bracketPos);
    console.log("filter newval", newval);
    console.log("filter nbrk", nbrk);
    let rgx = /(?<field>\w*)\[(?<idx>\d)\]\.Date/g;
    let res = rgx.exec(data.col);
    console.log("filter res", res);
    let regex = new RegExp('(?<field>\w*)\[(?<idx>\d)\]\.Date',"i");
      let mtc = data.col.match(regex);
      console.log("filter mtc", mtc);


    }
    console.log("filter val[newval]", val[newval]);
    if (val[newval].length>0) {
    console.log("filter val[newval][0]", val[newval][0]);
    console.log("filter val[newval][0].Date", val[newval][0].Date);
    }
    */
    if (bracketPos!=-1) {
      let nDate = new Date(data.val);
      let newval=data.col.substr(0,bracketPos);
      if (val[newval].length>0) {
        //console.log("SEL1 val[newval][0].Date", typeof(val[newval][0].Date));
        //console.log("SEL1 Date", typeof(nDate));
        if (new Date(val[newval][0].Date) > nDate) {
          //console.log("SEL1 FOUND val", val);
          memo.push(val);
        }
      }
    } else {
      if (isNaN(val[data.col])) {
        if (val[data.col].toLowerCase().includes(data.val)) {
          //console.log("SEL2 FOUND val", val);
          memo.push(val);
        }
      }
      else {
        if (val[data.col].includes(data.val)) {
          //console.log("SEL2B FOUND val", val);
          memo.push(val);
        }
      }
    }
  }
    return memo;
  }, []);
  this.setPage();
}

 sort(data:any) {
  console.log("sort event=",data);
  this.sortColumn = data.col;
  let sasc = 'asc';
  if (data.desc)
    sasc = 'desc';

  this.PeopleDataList = _.orderBy(this.PeopleDataList, [this.sortColumn],[!data.desc]); // Use Lodash to sort array by 'name'
  this.setPage();
}

 toJSONLocal (date:Date) {
	  var locl = new Date(date);
    //local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    console.log("toJSONLocal local.toUTCString()=",locl.toJSON());
    return locl.toJSON().slice(0, 10);
  }
  
//https://ng-bootstrap.github.io/#/components/modal/examples
  openPerson(content:any, person:Nullable<Person>) {
    console.log("open(person)=",person);
    if (person==null) {
      person = new Person();
      console.log("open(new person)=",person);
		this.selectedPerson=person;
		this.selectedAddress = new Address();
	}
	else
	{
    if (person.events[0]!=null){
      if (person.events[0].Date!=null) {
        person.events[0].displayDate=this.toJSONLocal(person.events[0].Date);
      }
    }
    else person.events[0] = new SSSEvent();

		this.message = "here is the select id = " + person._id;
    this.selectedPerson=person;
    
		if (this.selectedPerson.AddressID==null)
			this.selectedAddress = new Address();
		else {
			console.log("this.selectedPerson.AddressID=",this.selectedPerson.AddressID);
			//this.selectedAddress = _.find(this.AddressList, {id :this.selectedPerson["Address ID"]});
      this.selectedAddress = <Address> _.find(this.AddressList, { _id :this.selectedPerson.AddressID});
		}

		console.log("open(selectedAddress)=",this.selectedAddress);
	}


    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result=="Saving") {
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
    this.message = "";
    console.log("Save(person)=",this.selectedPerson);
    this._dataService.savePerson(this.selectedPerson)
    .subscribe(res => {
      console.log("back from user");
      console.log("Save res =",res);
      this.closeResult = res.data.status;
    },
    err => {
      console.log("Error from Save", err)
      if (err.status===403)
      this.message = "Save Access: " + err.statusText;
  });
  }

}
