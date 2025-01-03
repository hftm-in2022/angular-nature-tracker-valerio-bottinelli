import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log("authorization guard is triggerd");
    return new Promise<boolean>((resolve, reject) => {
      onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          try {
            const userDocRef = doc(this.firestore, `users/${user.uid}`);
            const userDoc = await getDoc(userDocRef);
            

            if (userDoc.exists()) {
              const userData = userDoc.data();
              const userRole = userData['role']; // Assuming the role field is stored as `role`
              console.log( "role is"+userData['role']);

              if (userRole === 2) {
                resolve(true);
              } else {
                console.log('Access denied: User does not have the required role.');
                this.router.navigate(['/home']); // Redirect to an unauthorized page or login
                resolve(false);
              }
            } else {
              console.log('User document not found in Firestore.');
              this.router.navigate(['/login']); // Redirect to login
              resolve(false);
            }
          } catch (error) {
            console.error('Error fetching user document:', error);
            this.router.navigate(['/login']); // Redirect to login
            resolve(false);
          }
        } else {
          console.log('No user is logged in.');
          this.router.navigate(['/login']); // Redirect to login
          resolve(false);
        }
      });
    });
  }
}
