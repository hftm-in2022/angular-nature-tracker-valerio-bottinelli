import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Blog } from '../../models/blog.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';


@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.scss']
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
    allowComments: false, 
    allowLikes: false, 
    likes: 0,
    comments: 0,
    read: 0,
  };
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private auth: Auth 
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

    const blogId = this.route.snapshot.paramMap.get('id');
    const user = this.auth.currentUser;
  
    if (!user) {
      alert('You must be logged in to save a blog.');
      return;
    }
  
   
    const authorId = user.uid;

    const processedTags = Array.isArray(this.blog.tags)
    ? [...new Set(this.blog.tags.map((tag) => tag.trim().toLowerCase()).filter((tag) => tag))]
    : [...new Set(this.blog.tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag))];


    if (this.isEditing && blogId) {
      const blogDocRef = doc(this.firestore, `blogs/${blogId}`);
      await setDoc(blogDocRef, {
        ...this.blog,
        authorId: authorId, // Save authorId
        tags: processedTags,
          allowComments: this.blog.allowComments, 
          allowLikes: this.blog.allowLikes,
      });
      alert('Blog updated successfully!');
    } else {
      const blogsCollection = collection(this.firestore, 'blogs');
      await setDoc(doc(blogsCollection), {
        ...this.blog,
        authorId: authorId, // Save authorId
        tags: processedTags,
        createdAt: new Date(),
        allowComments: this.blog.allowComments, 
      allowLikes: this.blog.allowLikes, 
      });
      alert('Blog created successfully!');
    }
  
    this.goToBlogs();
  }


 

  goToBlogs(): void {
    this.router.navigate(['/blogs']);
  }
}
