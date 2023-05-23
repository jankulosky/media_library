import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyHttpServiceService } from './dummy-http-service.service';

describe('DummyHttpServiceService', () => {
  let service: DummyHttpServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DummyHttpServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
