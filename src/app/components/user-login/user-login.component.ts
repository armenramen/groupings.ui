import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  isLoading = false;
  loginForm!: FormGroup;

  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  };


  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  login() {
    this.isLoading = true;
    this.userService.loginByEmail(this.email.value)
      .pipe(catchError(err => {
        console.log(err);
        return of(null);
      }))
      .subscribe((res: any) => {
        this.isLoading = false;
        if (res) {
          this.userService.setUserId(res.userId);
          console.log(this.userService.userId)
        }
      });
  }



}
