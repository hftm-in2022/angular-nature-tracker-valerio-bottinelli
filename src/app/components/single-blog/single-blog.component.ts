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
  orderBy,
  updateDoc,
  increment,
  arrayUnion,
} from '@angular/fire/firestore';
import { Blog } from '../../models/blog.model';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../models/comment.model';

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
    comments: 0,
    read: 0,
  };

  likedBlogs: Record<string, boolean> = {};
  currentUser: User | null = null;
  commentsarray: Comment[] = [];
  newComment = ''; 
  userMap: Record<string, string> = {};
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private auth: Auth
  ) {}

  async ngOnInit(): Promise<void> {
    const blogId = this.route.snapshot.paramMap.get('id');  // id kann mittels withComponentInputBinding als input definiert werden
    const user = this.auth.currentUser;
    if (blogId) {
      const blogDocRef = doc(this.firestore, `blogs/${blogId}`);
      const blogDoc = await getDoc(blogDocRef);
  
      if (blogDoc.exists()) {
        const data = blogDoc.data();
        this.blog = {
          ...data,
          id: blogDoc.id, 
          createdAt: data['createdAt'] ? new Date(data['createdAt'].toMillis()) : new Date(),
        } as Blog;
  
        console.log('Blog loaded in ngOnInit:', this.blog);
  
        await this.loadUsers(); // Load user data
        await this.loadComments(blogId); // Load comments
        if (user?.uid !== this.blog.authorId && !this.route.snapshot.url.some(seg => seg.path === 'edit')) {
          await updateDoc(blogDocRef, { read: (this.blog.read || 0) + 1 });
        }

      } else {
        alert('Blog not found.');
        this.router.navigate(['/blogs']);
      }
    }
  
    onAuthStateChanged(this.auth, async (user: User | null) => {
      this.currentUser = user;
      if (user) {
        await this.loadUserLikes();
      }
    });
  }

  async loadUsers(): Promise<void> {
    const usersCollection = collection(this.firestore, 'users');
    const snapshot = await getDocs(usersCollection);
  
    this.userMap = snapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      acc[doc.id] = data['username'] || 'Anonymous';
      return acc;
    }, {} as Record<string, string>);
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
    const blogDocId = blog.id; 
    const likesCollection = collection(this.firestore, 'likedBlogs');
    
  
    // Check if the user has already liked the blog
    const q = query(likesCollection, where('UserID', '==', userId), where('BlogID', '==', blogDocId));
    const snapshot = await getDocs(q);
  
    const blogDocRef = doc(this.firestore, `blogs/${blogDocId}`);
    let updatedLikes = blog.likes || 0;

  
    if (!snapshot.empty) {
      // Unlike the blog
      const likeDocRef = snapshot.docs[0].ref;
      await deleteDoc(likeDocRef);
  
      updatedLikes = Math.max(0, updatedLikes - 1);
      this.likedBlogs[blogDocId] = false;
  
      await updateDoc(blogDocRef, { likes: updatedLikes });
    } else {
      // Like the blog
      await addDoc(likesCollection, { UserID: userId, BlogID: blogDocId });
  
      updatedLikes += 1;
      this.likedBlogs[blogDocId] = true;
  
      await updateDoc(blogDocRef, { likes: updatedLikes });
      console.log('Blog ID used for toggleLike:', blogDocId);
      console.log('Current User ID:', userId);
      console.log('Updated likes:', updatedLikes);
    }
  
    
    this.blog.likes = updatedLikes;
  }
  

  getFormattedTags(tags: string | string[]): string {
    return Array.isArray(tags) ? tags.join(', ') : tags || '';
  }

  async loadComments(blogId: string): Promise<void> {
    const commentsCollection = collection(this.firestore, 'comments');
    const q = query(commentsCollection, where('BlogID', '==', blogId));
    const snapshot = await getDocs(q);
  
    this.commentsarray = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        BlogID: data['BlogID'] || '',
        UserID: data['UserID'] || '',
        content: data['content'] || '',
        createdAt: data['createdAt'] ? new Date(data['createdAt'].toMillis()) : new Date(),
      } as Comment;
    });
  
    const commentCount = this.commentsarray.length;
  
    this.blog.comments = commentCount;
  
    const blogDocRef = doc(this.firestore, `blogs/${blogId}`);
    await updateDoc(blogDocRef, { comments: commentCount });
  }
  

  async addComment(): Promise<void> {
    const blogId = this.route.snapshot.paramMap.get('id');
    const user = this.auth.currentUser;

    if (!user) {
      alert('You must be logged in to add a comment.');
      return;
    }

    if (!this.newComment.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    if (!blogId) {
      alert('Invalid blog ID.');
      return;
    }

    const commentsCollection = collection(this.firestore, 'comments');
    await addDoc(commentsCollection, {
      BlogID: blogId,
      UserID: user.uid,
      content: this.newComment,
      createdAt: new Date(),
    });

    this.newComment = '';
    await this.loadComments(blogId);
  }


  goToBlogs(): void {
    this.router.navigate(['/blogs']);
  }
}
