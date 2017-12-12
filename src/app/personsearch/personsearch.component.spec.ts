
//https://stackoverflow.com/questions/39599084/test-angular-2-0-0-component-with-http-request
import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { PersonsearchComponent } from './personsearch.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { DataService } from '../data.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Person } from '../Model/Person';


import { MoqDataService } from '../../../spec/MoqDataService.spec';


describe('PersonsearchComponent', () => {
  let component: PersonsearchComponent;
  let fixture: ComponentFixture<PersonsearchComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonsearchComponent ],
      imports: [ 
        BrowserModule,
        NgbModule.forRoot(),
        FormsModule     
      ],
      providers: [ {provide: DataService, useClass: MoqDataService} ]
 })

  });
  

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a service', inject([DataService], (_dataService: DataService) => {
    expect(_dataService).toBeTruthy();
  }));

  it('should create a service get injector', () => {
    let _dataService = fixture.debugElement.injector.get(DataService);
    expect(_dataService).toBeTruthy();
    
    //expect(MoqDataService == typeof(_dataService)).toBe(false);
    //console.log("typeof(_dataService)=", typeof(_dataService));
   // expect(typeof(_dataService)).toEqual('MoqDataService')
  });

  it('should have 1 Person in PeopleDataList', () => {
    expect(component.PeopleDataList.length).toEqual(1);
  });

  it('should have 1 Address in AddressList', () => {
    expect(component.AddressList.length).toEqual(1);
  });

  it('should have Save', () => {
    expect(component.Save()).not.toBeNull()
  });


/*
  it('should have 1 person from call ngOnInit', () => {
    console.log("start getUsers nginit");
    component.ngOnInit();
    console.log("component.PeopleDataList=",component.PeopleDataList);
    expect(component.PeopleDataList.length).toEqual(1);
    console.log("finee getUsers");
  });
*/
  /*
  it('stub object and injected DataService should not be the same',inject([DataService, MockBackend], (_dataService: DataService, backend: MockBackend) => {
    //let service = fixture.debugElement.injector.get(DataService);
    //spyOn(service, 'getUsers').and.returnValue(new Promise((resolve, reject) => { resolve(this.testData); }));

    //expect(service.getUsers).toHaveBeenCalled();
    //let componentMockRoomService = fixture.debugElement.injector.get(DataService);
    console.log("HEEEEEEEEEEEELLLO");

      spyOn(_dataService, 'getUsers').and.returnValue(Observable.of(this.testData));
        console.log("nginit");
        component.ngOnInit();
        console.log("after nginit");

        //return _dataService.getUsers().subscribe( data => {
        //  expect(data).toEqual(testData);
        //});
        //_dataService.getUsers().subscribe( data => { expect(data).toEqual(this.testData); });
        expect(_dataService.getUsers).toHaveBeenCalled();
        expect(_dataService.getUsers).toHaveBeenCalledTimes(1);
        
        expect(component).toBeTruthy();
        //console.log("component.users=",component.users);
        //console.log("component.users.length=",component.users.length);
        //expect(component.users.length).toEqual(2);
    
    //console.log(componentMockRoomService instanceof DataService);

    console.log("spytest0");
    spyOn(_dataService, 'getUsers').and.returnValue(testData);
    console.log("AFTER spytest0");

    console.log("nginit");
    component.ngOnInit();



//    console.log("getUsers called?");
//    expect(_dataService.getUsers).toHaveBeenCalled();
  
//    console.log("spytest");
//    let spy = spyOn(_dataService, 'getUsers').and.callThrough();
    
//    console.log("spytest2");
//    spyOn(_dataService, 'getUsers').and.returnValue(testData);

    
//      expect(MoqDataService === _dataService).toBe(false);
//    expect(_dataService.getUsers).toBe(true);
  }));
*/
/*
https://plnkr.co/edit/ahqYYJppMGoymzRyZwV8?p=preview
  it('should create the app', async(() => {
//    spy = spyOn(_dataService, 'getUsers')
//    .and.returnValue(Promise.resolve(testPerson));
  
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
  it('should render title in a h1 tag', async(() => {

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Our MongoDB is Working!');
  }));
*/

});
