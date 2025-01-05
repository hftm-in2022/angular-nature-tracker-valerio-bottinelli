import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { query, where, addDoc, setDoc, getDoc } from '@angular/fire/firestore';

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
import { ActivatedRoute } from '@angular/router';
import { SearchBarComponent } from "../search-bar/search-bar.component";

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatPaginatorModule, ButtonComponent, SearchBarComponent],
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
    comments: 0,
    read: 0,
  };

  isLoggedIn = false;
  currentUser: User | null = null;
  likedBlogs: Record<string, boolean> = {};
  isOnAllBlogsRoute = false;
  

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  
//initialization
  async ngOnInit(): Promise<void> {
    this.route.url.subscribe((segments) => {
      this.isOnAllBlogsRoute = segments.map(seg => seg.path).join('/') === 'blogs';
    });
    this.route.paramMap.subscribe(async (params) => {
      const tag = params.get('tag');
      
      if (tag) {
        // Load blogs by tag
        console.log("Tag selected: "+tag);
        await this.loadBlogsByTag(tag); 
      } else {
        // Load all blogs
        console.log("all blogs displayed");
        await this.loadBlogs(); 
      }
    });

    onAuthStateChanged(this.auth, async (user: User | null) => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      if (user) {
        await this.loadUserLikes();
      }
    });
  }

  async loadBlogsByTag(tag: string): Promise<void> {
    const blogsCollection = collection(this.firestore, 'blogs');
    const q = query(blogsCollection, where('tags', 'array-contains', tag));
    const snapshot = await getDocs(q);
  
    this.blogs = snapshot.docs.map((doc) => {
      const data = doc.data() as Partial<Blog>;
      return {
        id: doc.id,
        title: data.title || '',
        content: data.content || '',
        author: data.author || 'Unknown',
        authorId: data.authorId || '',
        createdAt: data.createdAt instanceof Date ? data.createdAt : new Date(),
        tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []), 
        allowComments: data.allowComments ?? false,
        allowLikes: data.allowLikes ?? false,
        likes: data.likes || 0,
        comments: data.comments || 0,
      } as Blog;
    });
  
    this.totalBlogs = this.blogs.length;
    this.updatePaginatedBlogs();
  }

  filterByTag(tag: string): void {
    this.router.navigate(['/blogs', tag]);
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
      comments: 0,
      read: 0,
    };
  }


  async loadBlogs(): Promise<void> {
    const blogsCollection = collection(this.firestore, 'blogs');
    const snapshot = await getDocs(blogsCollection);
  
    this.blogs = await Promise.all(
      snapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data() as Partial<Blog>;
  
        // Fetch author details
        const authorId = data.authorId || '';
        let authorName = 'Unknown';
  
        if (authorId) {
          const userDocRef = doc(this.firestore, `users/${authorId}`);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            authorName = userData['username'] || 'Unknown';
          }
        }
  
        return {
          id: docSnapshot.id,
          title: data.title || '',
          content: data.content || '',
          author: authorName,
          authorId: authorId,
          createdAt: data.createdAt instanceof Date ? data.createdAt : new Date(),
          tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
          allowComments: data.allowComments ?? false,
          allowLikes: data.allowLikes ?? false,
          likes: data.likes || 0,
          comments: data.comments || 0,
          read: data.read || 0,
        } as Blog;
      })
    );
  
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

  async deleteBlog(blogId: string, event: Event): Promise<void> {
    event.stopPropagation();
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
      tags: [],
      allowComments: false, 
      allowLikes: false,
      likes: 0,
      comments: 0,
      read: 0,
    };
  }

  getFormattedTags(tags: string | string[]): string[] {
    if (Array.isArray(tags)) {
      return tags;
    }
    return tags.split(',').map((tag) => tag.trim());
  }

  //Navigation
  navigateToCreate(): void {
    console.log("navigateToCreate is called");
    this.router.navigate(['/blogs/create']);
  }

  navigateToEdit(blogId: string, event: Event): void {
    event.stopPropagation();
    const blog = this.blogs.find((b) => b.id === blogId);
    if (blog) {
      console.log('Navigating to edit blog:', blog.title);
    }
    this.router.navigate(['/blogs/edit', blogId]);
  }

  navigateToTag(tag: string, event: Event): void {
    event.stopPropagation(); 

    console.log("navigation to blogview with tags: "+tag);
    this.router.navigate(['/blogs', tag]);
  }

  navigateToBlogs(): void {
    this.router.navigate(['/blogs']);
  }


  /* Likes */
  async toggleLike(blog: Blog,  event: Event): Promise<void> {
    event.stopPropagation();
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

  navigateToBlog(blogId: string): void {
    this.router.navigate(['/blog', blogId]);
  }
  
}
