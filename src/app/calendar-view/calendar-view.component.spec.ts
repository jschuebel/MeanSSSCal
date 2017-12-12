import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';


import { CalendarViewComponent } from './calendar-view.component';
import { CalendarModule } from 'angular-calendar';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { DataService } from '../data.service';
//import { HttpModule, Http, ConnectionBackend, BaseRequestOptions,ResponseOptions, XHRBackend } from '@angular/http';
import { MoqDataService } from '../../../spec/MoqDataService.spec';


describe('CalendarViewComponent', () => {
  let component: CalendarViewComponent;
  let fixture: ComponentFixture<CalendarViewComponent>;

  beforeEach(() => {
    
    TestBed.configureTestingModule({
      declarations: [ CalendarViewComponent ],
      imports: [ 
        BrowserModule,
        CalendarModule.forRoot(),
        FormsModule     
      ],
      providers: [ {provide: DataService, useClass: MoqDataService}  ]
      //providers: [  DataService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
