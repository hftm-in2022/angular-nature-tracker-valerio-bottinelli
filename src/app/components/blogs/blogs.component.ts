import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { query, where, addDoc, setDoc } from '@angular/fire/firestore';

import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from '@angular/fire/firestore';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Blog } from '../../models/blog.model';
//import { UserProfile } from '../../models/user.model';
import { Router } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule,MatPaginatorModule,ButtonComponent],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss'],
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];
  //pagination
  paginatedBlogs: Blog[] = []; 
  totalBlogs = 0; 
  itemsPerPage = 5; 
  currentPage = 1;

  isCreating = false;
  isEditing = false;
  currentBlog: Blog = {
    id: '',
    title: '',
    content: '',
    author: '',
    authorId: '',
    createdAt: new Date(),
    tags: [],
    allowComments: false, // Default value
    allowLikes: false, 
    likes: 0,
  };

  isLoggedIn = false;
  currentUser: User | null = null;
  likedBlogs: Record<string, boolean> = {};
  

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    onAuthStateChanged(this.auth, async (user: User | null) => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      if (user) {
        await this.loadUserLikes();
      }
    });
    await this.loadBlogs();
  }

  openCreateForm(): void {
    if (!this.isLoggedIn) {
      alert('You need to be logged in to create a blog.');
      return;
    }
    this.isCreating = true;
    this.currentBlog = {
      id: '',
      title: '',
      content: '',
      author: '',
      authorId: '',
      createdAt: new Date(),
      tags: [],
      allowComments:  false, 
      allowLikes: false,
      likes: 0,
    };
  }


  async loadBlogs(): Promise<void> {
    const blogsCollection = collection(this.firestore, 'blogs');
    const snapshot = await getDocs(blogsCollection);
  
    this.blogs = snapshot.docs.map((doc) => {
      const data = doc.data() as Partial<Blog>;
      return {
        id: doc.id,
        title: data.title || '',
        content: data.content || '',
        author: data.author || 'Unknown',
        authorId: data.authorId || '',
        createdAt: data.createdAt instanceof Date ? data.createdAt : new Date(),
        tags: Array.isArray(data.tags) ? data.tags : [],
        allowComments: data.allowComments ?? false,
        allowLikes: data.allowLikes ?? false,
        likes: data.likes || 0, 
      } as Blog;
    });
  
    this.totalBlogs = this.blogs.length;
    this.updatePaginatedBlogs();
  }
  

  updatePaginatedBlogs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBlogs = this.blogs.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.updatePaginatedBlogs();
  }

  async deleteBlog(blogId: string): Promise<void> {
    const blogDoc = doc(this.firestore, `blogs/${blogId}`);
    await deleteDoc(blogDoc);
    await this.loadBlogs();
  }

  cancel(): void {
    this.isCreating = false;
    this.isEditing = false;
    this.currentBlog = {
      id: '',
      title: '',
      content: '',
      author: '',
      authorId: '',
      createdAt: new Date(),
      tags: '',
      allowComments: false, 
      allowLikes: false,
      likes: 0,

    };
  }

  getFormattedTags(tags: string | string[]): string {
    return Array.isArray(tags) ? tags.join(', ') : tags;
  }

  //Navigation

  navigateToCreate(): void {
    this.router.navigate(['/blogs/create']);
  }

  navigateToEdit(blogId: string): void {
    const blog = this.blogs.find((b) => b.id === blogId);
    if (blog) {
      console.log('Navigating to edit blog:', blog.title);
    }
    this.router.navigate(['/blogs/edit', blogId]);
  }


  /* Likes */
  async toggleLike(blog: Blog): Promise<void> {
    if (!this.currentUser) {
      alert('You must be logged in to like a blog.');
      return;
    }
  
    const userId = this.currentUser.uid;
    const blogId = blog.id;
    const likesCollection = collection(this.firestore, 'likedBlogs');
  
    // Check if the user already liked the blog
    const q = query(
      likesCollection,
      where('UserID', '==', userId),
      where('BlogID', '==', blogId)
    );
    const snapshot = await getDocs(q);
  
    const blogDocRef = doc(this.firestore, `blogs/${blogId}`);
    let updatedLikes = blog.likes || 0;
  
    if (!snapshot.empty) {
      // Unlike: Delete the like entry
      const likeDocRef = snapshot.docs[0].ref;
      await deleteDoc(likeDocRef);
  
      // Update Firestore and UI
      updatedLikes = Math.max(0, updatedLikes - 1); // Avoid negative likes
      await setDoc(blogDocRef, { likes: updatedLikes }, { merge: true });
  
      blog.likes = updatedLikes;
      this.likedBlogs[blogId] = false;
    } else {
      // Like: Add a new entry
      await addDoc(likesCollection, {
        UserID: userId,
        BlogID: blogId,
      });
  
      // Update Firestore and UI
      updatedLikes += 1;
      await setDoc(blogDocRef, { likes: updatedLikes }, { merge: true });
  
      blog.likes = updatedLikes;
      this.likedBlogs[blogId] = true;
    }
  }
  

  async loadUserLikes(): Promise<void> {
    if (!this.currentUser) {
      return;
    }
    console.log("users likes got loaded");
    const likesCollection = collection(this.firestore, 'likedBlogs');
    const q = query(likesCollection, where('UserID', '==', this.currentUser.uid));
    const snapshot = await getDocs(q);
  
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data['BlogID']) {
        this.likedBlogs[data['BlogID']] = true;
      }
    });
  }
  
}
