import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { UserFormComponent } from './pages/UserForm/user-form/user-form';
import { UserList } from './pages/UserList/user-list/user-list';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },

  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'userForm', component: UserFormComponent, canActivate: [authGuard] },
  { path: 'userForm/:id', component: UserFormComponent, canActivate: [authGuard] },
{ path: 'userList', component: UserList, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
