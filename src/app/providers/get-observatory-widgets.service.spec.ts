import { TestBed, inject } from '@angular/core/testing';

import { GetObservatoryWidgetsService } from './get-observatory-widgets.service';

describe('GetObservatoryWidgetsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetObservatoryWidgetsService]
    });
  });

  it('should be created', inject([GetObservatoryWidgetsService], (service: GetObservatoryWidgetsService) => {
    expect(service).toBeTruthy();
  }));
});
