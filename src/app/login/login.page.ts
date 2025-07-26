import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl, NgForm  } from '@angular/forms';
import { IonicModule, ToastController, NavController} from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service'; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Alerts } from '../helpers/classes';
import {  UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  alerts: Alerts;
  @ViewChild('miFormulario', { static: false }) miFormulario!: NgForm;
  private currentToast: HTMLIonToastElement | null = null;

  validation_messages = {
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
        type: 'minLength', message: 'Cantidad de caracteres incorrecta'
      }
    ]
  }

  constructor(private formBuilder: FormBuilder, private toastController: ToastController, private authService: AuthService, private navCtrl: NavController, private storageService: StorageService, private userService: UserService) {
    this.alerts = new Alerts(toastController);
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

  ionViewWillLeave() {
    this.resetForm();
  }

  resetForm () {
    if (this.miFormulario) {
      this.miFormulario.resetForm();
    }
  }

  async loginUser(credentials: any) {
    const validationResult = this.loginValidations(this.loginForm);
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
      this.authService.loginUser(credentials).then(async (res) =>  {
        const userLogged = await this.userService.loginUser(credentials);
        if (userLogged.status == 'OK') {
          await this.alerts.presentToast('Inicio de sesión exitoso', 'success');
          setTimeout(async () => {
            await this.storageService.set('userSession', {loggedIn: true});
            this.navCtrl.navigateForward('menu/home');
          }, 1000);
        } 
      }).catch(async (error) => {
        await this.alerts.presentToast('Credenciales incorrectas', 'danger');
      });
    }
  }

  loginValidations (loginObj: {get: (key: string) => any}) {
    const emailInput = loginObj.get('email');
    const passwordInput = loginObj.get('password');
    let error = '';
    
    if ((emailInput.errors)) {
      error = Object.keys(emailInput.errors)[0];
      return {validation: false, module: 'email', typeError: error};
    } else if (passwordInput.errors){
      error = Object.keys(passwordInput.errors)[0];
      return {validation: false, module: 'password', typeError: error};
    }

    return {validation: true};
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}
