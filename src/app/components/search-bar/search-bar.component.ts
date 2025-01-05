import { Component, OnInit } from '@angular/core';
import { Firestore, collection, query, where, getDocs, orderBy, limit } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  featuredBlogs: { id: string; title: string }[] = [];
  tagQuery: string = '';


  constructor(private firestore: Firestore, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.loadTags();
    await this.loadFeaturedBlogs();
  }

  async loadTags(): Promise<void> {
    const tagsCollection = collection(this.firestore, 'tags');
    const snapshot = await getDocs(tagsCollection);
  }

  async loadFeaturedBlogs(): Promise<void> {
    const blogsCollection = collection(this.firestore, 'blogs');
  
    // Latest blog
    const latestSnapshot = await getDocs(
      query(blogsCollection, orderBy('createdAt', 'desc'), limit(1))
    );
    const latestBlog = latestSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data()['title'],
    }))[0];
  
    // Most liked in the last 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
    const mostLikedSnapshot = await getDocs(
      query(
        blogsCollection,
        where('createdAt', '>=', threeDaysAgo),
        orderBy('likes', 'desc'),
        limit(1)
      )
    );
    const mostLikedBlog = mostLikedSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data()['title'],
    }))[0];
  
    // Most read blog
    const mostViewedSnapshot = await getDocs(
      query(blogsCollection, orderBy('read', 'desc'), limit(1))
    );
    const mostViewedBlog = mostViewedSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data()['title'],
    }))[0];
  
    this.featuredBlogs = [
      { id: latestBlog?.id, title: latestBlog?.title || 'No blogs available' },
      { id: mostLikedBlog?.id, title: mostLikedBlog?.title || 'No blogs available' },
      { id: mostViewedBlog?.id, title: mostViewedBlog?.title || 'No blogs available' },
    ];
  }

  filterByTag(tag: string): void {
    if (!tag || tag.trim() === '') {
      alert('Please enter a valid tag.');
      return;
    }
  
    console.log('Navigating to blogs with tag:', tag);
    this.router.navigate(['/blogs', tag.trim().toLowerCase()]); 
  }

  viewBlog(blogId: string): void {
    this.router.navigate(['/blog', blogId]);
  }


}
