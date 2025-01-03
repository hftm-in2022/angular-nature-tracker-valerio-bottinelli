import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  
  constructor(private auth: Auth, private router: Router, private firestore: Firestore) {}

  canActivate(): Observable<boolean> {
    return new Observable((observer) => {
      onAuthStateChanged(this.auth, async (user: User | null) => {
        console.log('Auth state changed:', user);
        
        if (!user) {
          this.router.navigate(['/home']); 
          console.log("im not logged in");
          observer.next(false);
          observer.complete();
        } else {
          console.log("im  logged in");
          const userDocRef = doc(this.firestore, `users/${user.uid}`);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists() && userDoc.data()['role'] === 2) {
            observer.next(true); 
          } else {
            this.router.navigate(['/home']); 
            observer.next(false);
          }
          observer.complete();
        }
      });
    });
  }
}
