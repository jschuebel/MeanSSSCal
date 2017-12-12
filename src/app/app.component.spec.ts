import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';


import {  RouterTestingModule} from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { CalendarModule } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FormsModule }   from '@angular/forms';
import { DataService } from './data.service';

import { HeaderComponent } from './header/header.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { MoqDataService } from '../../spec/MoqDataService.spec';
import { Person } from './Model/Person';

import { HttpModule, Http, ConnectionBackend, BaseRequestOptions,ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection  } from '@angular/http/testing';
import { Observable } from 'rxjs/Rx';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
          AppComponent, 
          HeaderComponent,
          CalendarViewComponent
      ],
      imports: [ 
        BrowserModule,
        CommonModule,
        BrowserAnimationsModule,
        NgbModule.forRoot(),
        HttpModule,
        CalendarModule.forRoot(),
        FormsModule     
      ],
      providers: [
        DataService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backend, options) => { return new Http(backend, options); }
        }
     ],
      //providers: [  {provide: DataService, useValue: MoqDataService }  ]
      //providers: [  { provide: XMLHttpRequest, useClass: MockBackend },{provide: DataService, useValue: MoqDataService }  ]
    }).compileComponents();
  }));

/*
  it('should create', () => {
    expect(component.showSideBar).toBe(false);
  });
*/

  
    
});
