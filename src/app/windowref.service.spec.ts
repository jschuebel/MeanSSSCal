import { TestBed, inject } from '@angular/core/testing';

import { Windowref } from './windowref.service';

describe('WindowrefService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Windowref]
    });
  });

  it('should be created', inject([Windowref], (service: Windowref) => {
    expect(service).toBeTruthy();
  }));
});
