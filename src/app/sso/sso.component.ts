import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { AuthService } from '../auth.service'

@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.css']
})
export class SsoComponent implements OnInit {

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private _authService:AuthService) {

                console.log('this.activatedRoute', this.activatedRoute);

   this.activatedRoute.queryParams.subscribe(params => {
      const token = params['token'];
      console.log('token', token);

      const reftoken = params['reftoken'];
      console.log('reftoken', reftoken);

      this._authService.setAuthTokens(token, reftoken);
      this.router.navigateByUrl('/');
    });

   }

  ngOnInit() {
  }

}
