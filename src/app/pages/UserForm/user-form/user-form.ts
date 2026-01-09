import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

interface Department {
  id: number;
  name: string;
}

interface HobbiesOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.css']
})
export class UserFormComponent implements OnInit {

  userForm!: FormGroup;
  isEdit = false;
  userId: number | null = null;
  formLoaded = false;

  departments: Department[] = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'HR' },
    { id: 3, name: 'IT' }
  ];

  hobbiesOptions: HobbiesOption[] = [
    { id: 1, name: 'Reading' },
    { id: 2, name: 'Swimming' },
    { id: 3, name: 'Playing' },
    { id: 4, name: 'Singing' }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      departmentId: ['', Validators.required],
      dateOfJoining: ['', Validators.required],
      gender: ['M', Validators.required],
      hobbies: this.fb.array([])
    });

    const hobbiesArray = this.userForm.get('hobbies') as FormArray;
    this.hobbiesOptions.forEach(() => hobbiesArray.push(this.fb.control(false)));

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.userId = +id;
        this.isEdit = true;
        this.loadUser(this.userId); // ✅ API WILL HIT
      } else {
        this.isEdit = false;
        this.formLoaded = true;
      }
    });
  }

  get hobbiesControls() {
    return (this.userForm.get('hobbies') as FormArray).controls;
  }

  loadUser(id: number) {
    const token = localStorage.getItem('jwtToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .get<any>(`https://localhost:7073/api/User/GetById/${id}`, { headers })
      .subscribe(user => {

        this.userForm.patchValue({
          fullName: user.fullName,
          address: user.address,
          departmentId: user.departmentId,
          dateOfJoining: user.dateOfJoining?.substring(0, 10),
          gender: user.gender
        });

        const hobbiesIds = user.hobbieIds || [];

        this.hobbiesOptions.forEach((hobby, i) => {
          this.hobbiesControls[i].setValue(hobbiesIds.includes(hobby.id));
        });
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        this.formLoaded = true;
      });
  }


  save() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const selectedHobbiesIds = this.hobbiesOptions
      .filter((_, i) => this.hobbiesControls[i].value)
      .map(h => h.id);

    const payload = {
      id: this.userId ?? 0,
      fullName: this.userForm.value.fullName,
      address: this.userForm.value.address,
      departmentId: this.userForm.value.departmentId,
      dateOfJoining: this.userForm.value.dateOfJoining,
      gender: this.userForm.value.gender,
      hobbiesIds: selectedHobbiesIds
    };

    const token = localStorage.getItem('jwtToken');
    const headers = { Authorization: `Bearer ${token}` };

    if (this.isEdit && this.userId) {
      this.http
        .put(`https://localhost:7073/api/User/Update/${this.userId}`, payload, { headers })
        .subscribe(() => this.router.navigate(['/userList']));
    } else {
      this.http
        .post('https://localhost:7073/api/User/Create', payload, { headers })
        .subscribe(() => this.router.navigate(['/userList']));
    }
  }

  back() {
    this.router.navigate(['/userList']);
  }
}
