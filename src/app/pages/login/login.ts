import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  username = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isLoading = false;

login(): void {
  this.isLoading = true;

  this.authService.login(this.username, this.password).subscribe({
    next: (res) => {
        this.isLoading = false;
        localStorage.setItem('jwtToken', res.token);
        this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      if (err.status === 400) {
        alert(err.error);
        this.isLoading = false;
      } else {
        alert('Something went wrong. Please try again.');
        this.isLoading = false;
      }
      this.isLoading = false;
    }
  });
}
}
