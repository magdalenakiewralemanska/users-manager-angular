import { TestBed } from '@angular/core/testing';

import { AuthenticationRequestInterceptor } from './authentication-request.interceptor';

describe('AuthenticationRequestInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthenticationRequestInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthenticationRequestInterceptor = TestBed.inject(AuthenticationRequestInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
