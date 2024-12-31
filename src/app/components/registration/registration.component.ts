import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, User } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
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

        // Save user data to Firestore
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: new Date(),
          role: 'user', // Optional: Add roles or other metadata
        });

        alert('Registration successful and user data saved!');
      })
      .catch((error) => {
        console.error('Error registering user:', error.message);
        alert('Error: ' + error.message);
      });
  }
}
