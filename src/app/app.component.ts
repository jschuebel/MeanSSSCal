import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  showSideBar = false;
   // Define a users property to hold our user data
  users: Array<any>;
  
  constructor(private _dataService:DataService) {
  }

  ngOnInit() {
	   // Access the Data Service's getUsers() method we defined
     this._dataService.getUsers()
     .subscribe(res => this.users = res);
  } 
  
   onClickMe() {
    this.showSideBar = !this.showSideBar;
  }
}
