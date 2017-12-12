import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  showSideBar = false;
  
  constructor() {
  }

  ngOnInit() {  } 
  
   onClickMe() {
    this.showSideBar = !this.showSideBar;
  }
}
