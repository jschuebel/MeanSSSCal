import { Component, OnInit, Renderer2 } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Person } from '../Model/Person';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentChoice: string = "home";
  loginPerson: Person;
  isLoggedIn = false;
  message: string = "";
  showModal : boolean;

  constructor(private modalService: NgbModal,
              private renderer: Renderer2,
              private _dataService:DataService, 
              private _authService:AuthService) { }

  ngOnInit() {
    this.isLoggedIn = this._authService.isAuthenticated();
    this.loginPerson = new Person();
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

  hide()
  {
    this.showModal = false;
  }

  openLogin(loginpop:any, event:any) {

    console.log("OPENLOGIN redirecting to SSO");
    console.log("OPENLOGIN event", event);
    event.preventDefault();
    event.stopPropagation();
    window.location.href ="/api/login?ssoReturn=http://localhost:3000/sso/";
//    window.location.href = "http://sso.schuebelsoftware.com/api/login?ssoReturn=https://localhost:44330/sso/";
//    window.location.href = "http://sso.schuebelsoftware.com/api/login?ssoReturn=https://192.168.50.99:44330/sso/";

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

  Logout(event:any) {

    this._dataService.logout()
      .subscribe(res => {
        console.log("back from api test");
        console.log("test Token =", res);
        this.message = "back from server logout";
        //currently no claims added==>this.message = "User:" + res.username + " Role:" + res.claims[0].value;
      },
        err => {
          console.log("Error from test", err)
          if (err.status === 403 || err.status === 401)
            this.message = "Test Access: " + err.statusText;
        });

    this._authService.removeToken();
    this.message = "";
    event.preventDefault();
    event.stopPropagation();
   }

  Login() {
    this.showModal = false;
    console.log("Login(person)=",this.loginPerson);
    this._dataService.login(this.loginPerson)
    .subscribe(res => {
      console.log("back from user");
      console.log("Login Token =",res);
      this._authService.setAuthToken(res.access_token);
      this.message = "";
      //this.closeResult ="Login Access: Granted!";
      alert("Login Access: Granted!");
      //window.location.reload();
    },
    err => {
      console.log("Error from Login", err)
      if (err.status===403)
        this.message = "Login Failed! Access: " + err.statusText;
        //this.closeResult ="";
    });
  }

  checkAuth(event:any) {
    console.log("checkAuth called");
    this._dataService.loggeduser()
    .subscribe(res => {
      console.log("back from api test");
      console.log("test Token =", res);
      this.message = "back from server loggeduser";
      //this.message = "User:" + res.username + " Role:" + res.claims[0].value;
    },
    err => {
      console.log("Error from test", err)
      if (err.status===403 || err.status===401)
        this.message = "Test Access: " + err.statusText;
    });

    event.preventDefault();
    event.stopPropagation();

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
