import { Component, OnInit, Renderer2 } from '@angular/core';
import { Person } from '../Model/Person';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
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
  message: string;
 
  constructor(private _dataService:DataService, 
              private _authService:AuthService,
              private modalService: NgbModal,
              private renderer: Renderer2) { }

  ngOnInit() {
    this.isLoggedIn = this._authService.isAuthenticated();
    //TODO to use roles for loggedin call this instead 
    //this.checkAuth();
    
    //Create space for a login person
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

  
  checkAuth() {

    this._dataService.loggeduser()
    .subscribe(res => {
      console.log("back from api test");
      console.log("test Token =",res);
      this.message = "User:" + res.username + " Role:" + res.claims[0];
    },
    err => {
      console.log("Error from test", err)
      if (err.status===403)
        this.message = "Test Access: " + err.statusText;
    });
  }
  Logout() {
    this._authService.removeToken();
    this.message = "";
 
  }

  Login() {
    console.log("Login(person)=",this.loginPerson);
    //this.setActive('login');
    this._dataService.login(this.loginPerson)
    .subscribe(res => {
      console.log("back from user");
      console.log("Login Token =",res);
      this._authService.setAuthToken(res.token);
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

  openLogin(content) {

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
