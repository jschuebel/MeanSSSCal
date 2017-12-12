import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Person } from '../src/app/Model/Person';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { Event } from '../src/app/Model/Event';
import { Address } from '../src/app/Model/Address';

@Injectable()
export class MoqDataService {
    testPersonData: Person[] = [ new Person()];
    testEventData: Event[] = [ new Event()];
    testAddressData: Address[] = [ new Address()];
    
    constructor() { }

    protected _subscription: Subscription;
    protected _fakeContent: any;
    protected _fakeError: any;
  
    set error(err) {
      this._fakeError = err;
    }
  
    set content(data) {
      this._fakeContent = data;
    }
  
    get subscription(): Subscription {
      return this._subscription;
    }
  
    subscribe(next: Function, error?: Function, complete?: Function): Subscription {
      this._subscription = new Subscription();
      spyOn(this._subscription, 'unsubscribe');
  
      if (next && this._fakeContent && !this._fakeError) {
        next(this._fakeContent);
      }
      if (error && this._fakeError) {
        error(this._fakeError);
      }
      if (complete) {
        complete();
      }
      return this._subscription;
    }
      
    getEvents(): Observable<Event[]> {
        console.log("mock getEvents service reached");
        return Observable.of(this.testEventData);
    }

    getAddresses(): Observable<Address[]> {
        console.log("mock getAddresses service reached");
        return Observable.of(this.testAddressData);
    }

    getCategories(): Observable<Event[]> {
        console.log("mock getCategories service reached");
        return Observable.of(this.testEventData);
    }

    getCalendarEvents(firstDay, lastDay): Observable<Event[]> {
        console.log("mock getCalendarEvents service reached");
        return Observable.of(this.testEventData);
    }

    getUsers(): Observable<Person[]> {
        console.log("mock getUsers service reached");
        return Observable.of(this.testPersonData);
    }

    savePerson(selectedPerson): Observable<any> {
        console.log("mock savePerson service reached");
        let response = {
            status: 200,
            data: [],
            message: 'back from savePerson'
        };
        return Observable.of(response);
    }
    /*
    getUsers(): Promise<Person[]> {
        console.log("mock service reached");
        return new Promise((resolve, reject) => {
            resolve(this.testData);
        });
    }*/
}
