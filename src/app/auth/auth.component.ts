import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
      password: '',
    });
  }

  login() {
    console.log('login', this.form.value);
    if (this.form.value.email == 'admin' && this.form.value.password == 'strela')
      this.router.navigateByUrl('/home')
    // if (this.form.get('email').value === 'tagay.aldiyar@gmail.com') {
    // }
  }
}
