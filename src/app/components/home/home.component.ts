import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Timestamp } from '@firebase/firestore';

interface UserData {
  email: string;
  createdAt: Timestamp;
  role: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  userData: UserData | null = null;
  roleName: string | null = null;
  loading = true;

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
          const data = userDoc.data() as UserData;
          this.userData = {
            email: data.email,
            createdAt: data.createdAt,
            role: data.role,
          };

          // Fetch the role name from the roles collection
          const roleDocRef = doc(this.firestore, `roles/${data.role}`);
          const roleDoc = await getDoc(roleDocRef);
          if (roleDoc.exists()) {
            this.roleName = roleDoc.data()['name'];
          } else {
            console.log('Role not found in Firestore.');
          }
        } else {
          console.log('No user data found in Firestore.');
        }
      } else {
        console.log('No user is logged in.');
      }
      this.loading = false;
    });
  }
}
