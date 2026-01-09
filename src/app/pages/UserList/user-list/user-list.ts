import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html'
})
export class UserList implements OnInit {
  users: any[] = [];
  searchText: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(search?: string): void {
    this.isLoading = true;

    const token = localStorage.getItem('jwtToken');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;

    const query = search ? `?searchText=${encodeURIComponent(search.trim())}` : '';
    const url = `https://localhost:7073/api/User/GetAll${query}`;

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (res) => {
        this.users = res;
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.users = [];
        this.isLoading = false;
      }
    });
  }

  onSearchClick(): void {
    this.loadUsers(this.searchText);
  }

  editUser(id: number) {
    this.router.navigate(['/userForm', id]);
  }

  createUser(): void {
    this.router.navigate(['/userForm']);
  }

  back() {
    this.router.navigate(['/dashboard']);
  }
}
