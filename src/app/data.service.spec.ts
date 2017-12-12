import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';
import { HttpModule } from '@angular/http';
import { Person } from './Model/Person';

describe('DataService', () => {
  let testData: Person[] = [ new Person()];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [DataService]
    });
  });
  
  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));
  /*
  it('should call be created', inject([DataService], (service: DataService) => {
      service.getUsers().subscribe( data => { expect(data).toEqual(testData); });
  }));
  */
});
