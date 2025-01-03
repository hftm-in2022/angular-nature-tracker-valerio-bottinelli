import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { BlogEditorComponent } from './components/blog-editor/blog-editor.component';
import { SingleBlogComponent } from './components/single-blog/single-blog.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'blogs/create', component: BlogEditorComponent },
  { path: 'blogs/edit/:id', component: BlogEditorComponent },
 // { path: 'user-management', component: UserManagementComponent},
  { path: 'blog/:id', component: SingleBlogComponent },
  //Default Routes
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
  //Authentification guards
  { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard] },
]
