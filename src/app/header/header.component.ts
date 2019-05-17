import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentChoice: string = "home";
 
  constructor() { }

  ngOnInit() {
  }

  
  setActive(choice: string): void{
      this.currentChoice = choice;
  }

  getActive(choice: string) : string{
      if(this.currentChoice == choice)
           return "nav-link active";
      else
           return "nav-link";

  }
}
