import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';




interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: number;
  blogCount: number; // Dummy value
}

interface Role {
  id: number;
  name: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, MatPaginatorModule, MatFormFieldModule, MatSelectModule],
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  users: UserProfile[] = [];
  roles: Role[] = [];
  currentUser: User | null = null; 
  isLoggedIn = false;
  isLoading = true;
  
  //pagination
  allUsers: UserProfile[] = []; 
  paginatedUsers: UserProfile[] = []; 
  totalUsers = 0; 
  itemsPerPage= 10; 
  currentPage= 1; 

  constructor(private firestore: Firestore, private auth: Auth) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.currentUser = user;
      this.isLoggedIn = !!user; 
    });

    await this.loadRoles();
    await this.loadUsers();
    this.isLoading = false;
  }

  async loadRoles(): Promise<void> {
    const rolesCollection = collection(this.firestore, 'roles');
    const snapshot = await getDocs(rolesCollection);

    this.roles = snapshot.docs.map(doc => ({
      id: parseInt(doc.id, 10),
      name: doc.data()['name'] || 'Unnamed Role',
    }));
  }

  async loadUsers(): Promise<void> {
    const usersCollection = collection(this.firestore, 'users');
    const snapshot = await getDocs(usersCollection);
  
    // Temporarily hold users data
    const tempUsers: UserProfile[] = [];
  
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
  
      // Fetch blog count for the user
      const blogsCollection = collection(this.firestore, 'blogs');
      const q = query(blogsCollection, where('authorId', '==', docSnapshot.id));
      const blogsSnapshot = await getDocs(q);
  
      // Push user profile to the temporary array
      tempUsers.push({
        id: docSnapshot.id,
        username: data['username'] || 'N/A',
        email: data['email'] || 'N/A',
        role: data['role'],
        blogCount: blogsSnapshot.size, 
      } as UserProfile);
    }
  
    // Assign to `allUsers` and update pagination
    this.allUsers = tempUsers;
    this.totalUsers = tempUsers.length;
    this.updatePaginatedUsers();
  }


  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
  
    this.paginatedUsers = this.allUsers.slice(startIndex, endIndex);
  }


  async updateRole(userId: string, newRole: number): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    await updateDoc(userDocRef, { role: newRole });
    console.log(`Role updated for user ${userId} to ${newRole}`);
  }


  
}
