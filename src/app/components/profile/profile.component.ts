import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  isEditing = false;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) {}

  async ngOnInit(): Promise<void> {
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          this.userProfile = userDoc.data() as UserProfile;
          console.log('User profile loaded:', this.userProfile);
        } else {
          console.log('User document not found in Firestore.');
          this.userProfile = {
            email: user.email || '',
            username: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            role: 1,
          };
        }
      } else {
        console.log('No user is logged in.');
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  async saveProfile(): Promise<void> {
    const user = this.auth.currentUser;
    if (user && this.userProfile) {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userDocRef, {
        username: this.userProfile.username || null,
        firstName: this.userProfile.firstName || null,
        lastName: this.userProfile.lastName || null,
        dateOfBirth: this.userProfile.dateOfBirth || null,
      })
        .then(() => {
          this.isEditing = false;
          console.log('Profile updated successfully.');
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
        });
    }
  }
}
