/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GroupingsService } from './groupings.service';

describe('Service: Groupings', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupingsService]
    });
  });

  it('should ...', inject([GroupingsService], (service: GroupingsService) => {
    expect(service).toBeTruthy();
  }));
});
