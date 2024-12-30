import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private auth: Auth) {}

  login(email: string, password: string): void {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    console.log('Attempting to log in with email:', email);
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log('User logged in:', userCredential.user);
        alert('Login successful!');
      })
      .catch((error) => {
        console.error('Error logging in:', error.message);
        alert('Error: ' + error.message);
      });
  }
}
