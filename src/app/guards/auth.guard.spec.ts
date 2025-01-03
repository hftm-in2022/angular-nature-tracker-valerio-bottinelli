import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let authSpy: jasmine.SpyObj<Auth>;
  let firestoreSpy: jasmine.SpyObj<Firestore>;

  beforeEach(() => {
    // Create spies for dependencies
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authSpy = jasmine.createSpyObj('Auth', ['currentUser']);
    firestoreSpy = jasmine.createSpyObj('Firestore', ['doc', 'getDoc']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy },
        { provide: Auth, useValue: authSpy },
        { provide: Firestore, useValue: firestoreSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // Add more tests as needed
});
