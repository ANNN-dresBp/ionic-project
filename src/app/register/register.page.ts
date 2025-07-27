import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule, ToastController, NavController} from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service'; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Alerts } from '../helpers/classes';
import {  UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class RegisterPage implements OnInit {
  alerts: Alerts;
  registerForm: FormGroup;
  private currentToast: HTMLIonToastElement | null = null;

  validation_messages = {
    name: [
      {
        type: 'required', message: 'Debe ingresar su(s) nombre(s)!',
      }
    ],
    userName: [
      {
        type: 'required', message: 'Debe ingresar su(s) apellido(s)!',
      }
    ],
    email: [
      {
        type: 'required', message: 'Debe ingresar un correo!',
      },
      {
        type: 'email', message: 'Formato de correo incorrecto'
      }
    ],
    password: [
      {
        type: 'required', message: 'Debe ingresar la contraseña!'
      },
      {
        type: 'minlength', message: 'Cantidad de caracteres incorrecta'
      },
      {
        type: 'confirm', message: 'Las contraseñas no coinciden'
      } 
    ]
  }

  constructor(private formBuilder: FormBuilder, private toastController: ToastController, private authService: AuthService, private navCtrl: NavController, private storageService: StorageService, private userService: UserService) { 
    this.alerts = new Alerts(toastController);
    this.registerForm = this.formBuilder.group(
      {
        name: new FormControl (
          '',
          Validators.compose(
            [
              Validators.required,
            ]
          )
        ),
        userName: new FormControl (
          '',
          Validators.compose(
            [
              Validators.required,
            ]
          )
        ),
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
        ),
        passwordConfirm: new FormControl (
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

  async registerUser(credentials: any) {
    const validationResult = this.registerValidations(this.registerForm);
    if (!validationResult.validation) {
      const moduleName = validationResult.module as keyof typeof this.validation_messages;
      const errorType = validationResult.typeError;

      let messageToShow = 'Error de validación desconocido.';
      if (moduleName && this.validation_messages[moduleName]) {
        const errorMessageObj = this.validation_messages[moduleName].find(
          msg => msg.type === errorType
        );

        if (errorMessageObj) {
          messageToShow = errorMessageObj.message;
        }
      }
      await this.alerts.presentToast(messageToShow, 'danger');
    } else {
      const loginErrorMessage = '';
      console.log(credentials);
      this.authService.registerUser(credentials).then(async (res) =>  {
        console.log(res)
        console.log(credentials)
        const registeredUser = await this.userService.registerUser(credentials);
        console.log(registeredUser);
        if (registeredUser.status == 'OK') {
          await this.alerts.presentToast('Usuario creado exitosamente!', 'success');
          setTimeout(async () => {
            await this.storageService.set('userData', credentials);
            this.navCtrl.navigateForward('/login');
          }, 1000);
        }
        
      }).catch(async (error) => {
        await this.alerts.presentToast('Credenciales incorrectas', 'danger');
      });
    }
  }

  registerValidations (registerObj: {get: (key: string) => any}) {
    const nameInput = registerObj.get('name');
    const userNameInput = registerObj.get('userName');
    const emailInput = registerObj.get('email');
    const passwordInput = registerObj.get('password');
    const passwordConfirm = registerObj.get('passwordConfirm');
    let error = '';
    // console.log(passwordConfirm)
    if ((nameInput.errors)) {
      error = Object.keys(nameInput.errors)[0];
      return {validation: false, module: 'name', typeError: error};
    } else if ((userNameInput.errors)) {
      error = Object.keys(userNameInput.errors)[0];
      return {validation: false, module: 'userName', typeError: error};
    } else if ((emailInput.errors)) {
      error = Object.keys(emailInput.errors)[0];
      return {validation: false, module: 'email', typeError: error};
    } else if (passwordInput.errors) {
      error = Object.keys(passwordInput.errors)[0];
      return {validation: false, module: 'password', typeError: error};
    } else if (passwordConfirm.errors) {
      error = Object.keys(passwordConfirm.errors)[0];
      return {validation: false, module: 'password', typeError: error};
    } else if (passwordInput.value !== passwordConfirm.value) {
      return {validation: false, module: 'password', typeError: 'confirm'};
    }

    return {validation: true};
  }

  goBackLogin() {
    this.navCtrl.navigateBack('/login');
  }
}
