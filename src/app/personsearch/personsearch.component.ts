import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-personsearch',
  templateUrl: './personsearch.component.html',
  styleUrls: ['./personsearch.component.css']
})
export class PersonsearchComponent implements OnInit {
  isBusy = true;
  message = "People List Message";
  PeopleDataList = [];
  pagedItems: any[];
  selectedPerson: any;
  errorMessage = "";

  currentPage = 0;
  pageSize = 10;
  numberOfPages=2;
  closeResult: string;
  
  constructor(private _dataService:DataService, private modalService: NgbModal) { }

  ngOnInit() {
    this._dataService.getUsers()
    .subscribe(res => {
      this.PeopleDataList = res;
      console.log("peoplelist=",this.PeopleDataList);
      this.numberOfPages = Math.round(this.PeopleDataList.length / this.pageSize);
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

    console.log("peoplelist len=",this.PeopleDataList.length, "  currpage=", this.currentPage, "   pagesize=", this.pageSize);
    this.pagedItems = this.PeopleDataList.slice(this.currentPage*this.pageSize, this.currentPage*this.pageSize + this.pageSize);
    console.log("this.pagedItems=",this.pagedItems);
  }
 toJSONLocal (date) {
	var local = new Date(date);
	//local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
	return local.toJSON().slice(0, 10);
}
//https://ng-bootstrap.github.io/#/components/modal/examples
  open(content, person) {
    console.log("open(person)=",person);
	if (person.events[0].Date!=null)
		person.events[0].Date = this.toJSONLocal(person.events[0].Date);
    this.message = "here is the select id = " + person.id;
    this.selectedPerson=person;
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
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
