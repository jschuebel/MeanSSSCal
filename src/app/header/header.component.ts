import { Component, OnInit, Renderer2 } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentChoice: string = "home";
  isLoggedIn = false;
  message: string = "";
 
  constructor(private modalService: NgbModal,
              private renderer: Renderer2) { }

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

  
  Logout() {
  }

  Login() {
  }

  checkAuth() {}
  openLogin(content:any) {

    window.location.href="http://localhost:3000/api/login?ssoReturn=http://sss2:3000/sso/";

    return;
/*
    const modalRef = this.modalService.open(content);
    let userNameElRef = this.renderer.selectRootElement("#txtUserName");
    userNameElRef.focus();
    this.loginPerson.Name="";
    this.loginPerson.Pager="";

    modalRef.result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
      console.log("openLogin result=", result);
      if (result=="Login") {
        //console.log("loginPerson",this.loginPerson);
        this.Login();
      }
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
*/    
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
