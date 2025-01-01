import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
  ) {}

  register(email: string, password: string, repeatPassword: string): void {
    if (password !== repeatPassword) {
      alert('Passwords do not match!');
      return;
    }

    createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        const user: User = userCredential.user;
        console.log('User registered:', user);

        // Save minimal user data to Firestore
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        await setDoc(userDocRef, {
          email: user.email,
          username: null,
          firstName: null,
          lastName: null,
          dateOfBirth: null,
          createdAt: new Date(),
          role: 1, // Default role ID for "user"
        });

        alert('Registration successful!');
        this.router.navigate(['/profile']); // Redirect to profile page
      })
      .catch((error) => {
        console.error('Error registering user:', error.message);
        alert('Error: ' + error.message);
      });
  }
}
