import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [ButtonComponent, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private auth: Auth,
    private router: Router,
  ) {}

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn = !!user;
    });
  }

  logout(): void {
    signOut(this.auth)
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }
}
