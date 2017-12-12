import { async, ComponentFixture, TestBed } from '@angular/core/testing';
//import {  BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';

import { EventsearchComponent } from './eventsearch.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule }   from '@angular/forms';
import { DataService } from '../data.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MoqDataService } from '../../../spec/MoqDataService.spec';


describe('EventsearchComponent', () => {
  let component: EventsearchComponent;
  let fixture: ComponentFixture<EventsearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsearchComponent ],
      imports: [ BrowserModule,
          CommonModule,
          BrowserAnimationsModule,
          NgbModule.forRoot(),
          FormsModule     
      ],
      providers: [ {provide: DataService, useClass: MoqDataService}  ]
      //providers: [DataService],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
