import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  Firestore, 
  doc, 
  getDoc, 
  query, 
  where, 
  getDocs, 
  collection, 
  addDoc, 
  deleteDoc, 
  setDoc,
} from '@angular/fire/firestore';
import { Blog } from '../../models/blog.model';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-single-blog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './single-blog.component.html',
  styleUrls: ['./single-blog.component.scss'],
})
export class SingleBlogComponent implements OnInit {
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
  };

  likedBlogs: Record<string, boolean> = {};
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private auth: Auth
  ) {}

  async ngOnInit(): Promise<void> {
    // Fetch the blog by ID
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      const blogDocRef = doc(this.firestore, `blogs/${blogId}`);
      const blogDoc = await getDoc(blogDocRef);

      if (blogDoc.exists()) {
        this.blog = { id: blogDoc.id, ...blogDoc.data() } as Blog;
      } else {
        alert('Blog not found.');
        this.router.navigate(['/blogs']);
      }
    }

    // Fetch the current user
    onAuthStateChanged(this.auth, async (user: User | null) => {
      this.currentUser = user;
      if (user) {
        await this.loadUserLikes();
      }
    });
  }

  async loadUserLikes(): Promise<void> {
    if (!this.currentUser) {
      return;
    }

    const likesCollection = collection(this.firestore, 'likedBlogs');
    const q = query(likesCollection, where('UserID', '==', this.currentUser.uid));
    const snapshot = await getDocs(q);

    snapshot.docs.forEach((doc) => {
      const data = doc.data() as { BlogID: string };
      if (data.BlogID) {
        this.likedBlogs[data.BlogID] = true;
      }
    });
  }

  async toggleLike(blog: Blog): Promise<void> {
    if (!this.currentUser) {
      alert('You must be logged in to like a blog.');
      return;
    }

    const userId = this.currentUser.uid;
    const blogId = blog.id;
    const likesCollection = collection(this.firestore, 'likedBlogs');

    // Check if the user has already liked the blog
    const q = query(likesCollection, where('UserID', '==', userId), where('BlogID', '==', blogId));
    const snapshot = await getDocs(q);

    const blogDocRef = doc(this.firestore, `blogs/${blogId}`);
    let updatedLikes = blog.likes || 0;

    if (!snapshot.empty) {
      // Unlike the blog
      const likeDocRef = snapshot.docs[0].ref;
      await deleteDoc(likeDocRef);

      updatedLikes = Math.max(0, updatedLikes - 1);
      this.likedBlogs[blogId] = false;

      await setDoc(blogDocRef, { likes: updatedLikes }, { merge: true });
    } else {
      // Like the blog
      await addDoc(likesCollection, { UserID: userId, BlogID: blogId });

      updatedLikes += 1;
      this.likedBlogs[blogId] = true;

      await setDoc(blogDocRef, { likes: updatedLikes }, { merge: true });
    }

    // Update the local blog object
    this.blog.likes = updatedLikes;
  }

  getFormattedTags(tags: string | string[]): string {
    return Array.isArray(tags) ? tags.join(', ') : tags || '';
  }

  goToBlogs(): void {
    this.router.navigate(['/blogs']);
  }
}
