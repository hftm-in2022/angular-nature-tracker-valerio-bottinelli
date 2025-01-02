import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
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
  userRole: number | null = null;
  currentUser: User | null = null;

  constructor(
    private auth: Auth, 
    private router: Router,
    private firestore: Firestore,
  ) {}
    

  ngOnInit(): void {
    onAuthStateChanged(this.auth, async (user) => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      if (user) {
        // Fetch user's role from Firestore
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.userRole = userData['role'] || null; // Get the role, default to null if not found
        }
      }
    });
  }

  logout(): void {
    signOut(this.auth)
      .then(() => {
        this.userRole = null;
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }
  
}
