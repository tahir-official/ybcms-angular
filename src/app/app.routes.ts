import { Routes } from '@angular/router';

const routes: Routes = [
  // Existing UserList route (assuming it exists)
  {
    path: 'users',
    loadComponent: () =>
      import('./user-list/user-list.component').then(m => m.UserListComponent)
  },

  // New Testimonials route
  {
    path: 'testimonial',
    loadComponent: () =>
      import('./testimonials/components/testimonials.component').then(m => m.TestimonialsComponent)
  },

  // Default route
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: '**', redirectTo: '/users' } // fallback
];

export default routes;
