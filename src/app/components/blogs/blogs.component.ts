import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  getDoc,
} from '@angular/fire/firestore';
import { Blog } from '../../models/blog.model';
import { UserProfile } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss'],
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];
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
  };
  isLoggedIn = false;
  currentUser: User | null = null;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
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
        createdAt: data.createdAt instanceof Date ? data.createdAt : new Date(), // Use as-is if it's already a Date
        tags: Array.isArray(data.tags) ? data.tags : [],
      } as Blog;
    });
  }

  async saveBlog(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      alert('You need to be logged in to create or edit blogs.');
      return;
    }

    // Fetch the user's username from Firestore
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const userDoc = await getDoc(userDocRef);

    const username = userDoc.exists()
      ? (userDoc.data() as UserProfile).username
      : 'Anonymous';

    const blogsCollection = collection(this.firestore, 'blogs');
    console.log('Current Blog:', this.currentBlog);
    if (this.isCreating) {
      await addDoc(blogsCollection, {
        title: this.currentBlog.title,
        content: this.currentBlog.content,
        author: username,
        authorId: user.uid,
        createdAt: new Date(),
        tags:
          typeof this.currentBlog.tags === 'string'
            ? this.currentBlog.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag !== '')
            : this.currentBlog.tags,
      });
    } else if (this.isEditing && this.currentBlog.id) {
      const blogDoc = doc(this.firestore, `blogs/${this.currentBlog.id}`);
      await updateDoc(blogDoc, {
        title: this.currentBlog.title,
        content: this.currentBlog.content,
        tags:
          typeof this.currentBlog.tags === 'string'
            ? this.currentBlog.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag !== '')
            : this.currentBlog.tags,
        author: username,
        authorId: user.uid,
        createdAt: this.currentBlog.createdAt || new Date(),
      });
    }

    this.isCreating = false;
    this.isEditing = false;
    await this.loadBlogs();
  }

  editBlog(blog: Blog): void {
    this.isEditing = true;
    this.currentBlog = {
      ...blog,
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags,
    };
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
}
