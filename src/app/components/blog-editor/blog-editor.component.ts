import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Blog } from '../../models/blog.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.scss'],
})
export class BlogEditorComponent implements OnInit {
  blog: Blog = {
    id: '',
    title: '',
    content: '',
    author: '',
    authorId: '',
    createdAt: new Date(),
    tags: [],
  };
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
  ) {}

  async ngOnInit(): Promise<void> {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      const blogDocRef = doc(this.firestore, `blogs/${blogId}`);
      const blogDoc = await getDoc(blogDocRef);
      if (blogDoc.exists()) {
        this.blog = { id: blogDoc.id, ...blogDoc.data() } as Blog;
      }
      this.isEditing = !!blogId;
    }
  }

  async saveBlog(): Promise<void> {
    const blogId = this.route.snapshot.paramMap.get('id'); // Get blog ID from route if editing

    // Check if we are editing or creating a new blog
    if (this.isEditing && blogId) {
      const blogDocRef = doc(this.firestore, `blogs/${blogId}`);
      await setDoc(blogDocRef, {
        ...this.blog,
        tags: Array.isArray(this.blog.tags)
          ? this.blog.tags
          : this.blog.tags.split(',').map((tag) => tag.trim()),
      });
      alert('Blog updated successfully!');
    } else {
      const blogsCollection = collection(this.firestore, 'blogs');
      await setDoc(doc(blogsCollection), {
        ...this.blog,
        tags: Array.isArray(this.blog.tags)
          ? this.blog.tags
          : this.blog.tags.split(',').map((tag) => tag.trim()),
        createdAt: new Date(),
      });
      alert('Blog created successfully!');
    }

    this.goToBlogs(); // Redirect to blogs list after saving
  }

  goToBlogs(): void {
    this.router.navigate(['/blogs']);
  }
}
