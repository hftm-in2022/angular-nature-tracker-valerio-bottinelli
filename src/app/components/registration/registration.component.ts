import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  constructor(private auth: Auth) {}

  register(email: string, password: string, repeatPassword: string): void {
    if (password !== repeatPassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log('Attempting to register with email:', email);
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log('User registered:', userCredential.user);
        alert('Registration successful!');
      })
      .catch((error) => {
        console.error('Error registering user:', error.message);
        alert('Error: ' + error.message);
      });
  }
}
