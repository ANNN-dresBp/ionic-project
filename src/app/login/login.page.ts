import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  validation_messages = {
    email: [
      {
        type: 'required', message: 'El campo es obligatorio',
      },
      {
        type: 'email', message: 'Formato de correo incorrecto'
      }
    ]
  }

  constructor( private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group(
      {
        email: new FormControl (
          '',
          Validators.compose(
            [
              Validators.required,
              Validators.email
            ]
          )
        ),
        password: new FormControl (
          '',
          Validators.compose(
            [
              Validators.required,
              Validators.minLength(8)
            ]
          )
        )
      }
    );
  }

  ngOnInit() {
  }

  loginUser(credentials: any) {
    console.log(credentials)
  }
}
