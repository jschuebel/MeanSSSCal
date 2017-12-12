import { async, ComponentFixture, TestBed } from '@angular/core/testing';
//import {  BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';

import { EmailComponent } from './email.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule }   from '@angular/forms';
import { DataService } from '../data.service';

import { MoqDataService } from '../../../spec/MoqDataService.spec';

describe('EmailComponent', () => {
  let component: EmailComponent;
  let fixture: ComponentFixture<EmailComponent>;

  /*
  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });
  */
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailComponent ],
      imports: [ BrowserModule,
          CommonModule,
          BrowserAnimationsModule,
          FormsModule     
      ],
      providers: [ {provide: DataService, useClass: MoqDataService}  ]
      //providers: [DataService],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
