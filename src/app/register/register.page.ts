import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule, ToastController, NavController} from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service'; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  private currentToast: HTMLIonToastElement | null = null;

  validation_messages = {
    name: [
      {
        type: 'required', message: 'Debe ingresar su(s) nombre(s)!',
      }
    ],
    lastName: [
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
        type: 'minLength', message: 'Cantidad de caracteres incorrecta'
      }
    ]
  }

  constructor(private formBuilder: FormBuilder, private toastController: ToastController, private authService: AuthService, private navCtrl: NavController, private storageService: StorageService) { 
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
        lastName: new FormControl (
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

      await this.presentToast(messageToShow, 'danger');
    } else {
      const loginErrorMessage = '';
      this.authService.registerUser(credentials).then(async (res) =>  {
        this.navCtrl.navigateForward('/login');
        await this.storageService.set('userData', credentials);
      }).catch(async (error) => {
        await this.presentToast('Credenciales incorrectas', 'danger');
      });
    }
  }

  registerValidations (registerObj: {get: (key: string) => any}) {
    const nameInput = registerObj.get('name');
    const lastNameInput = registerObj.get('lastName');
    const emailInput = registerObj.get('email');
    const passwordInput = registerObj.get('password');
    let error = '';
    
    if ((nameInput.errors)) {
      error = Object.keys(nameInput.errors)[0];
      return {validation: false, module: 'name', typeError: error};
    } else if ((lastNameInput.errors)) {
      error = Object.keys(lastNameInput.errors)[0];
      return {validation: false, module: 'lastName', typeError: error};
    } else if ((emailInput.errors)) {
      error = Object.keys(emailInput.errors)[0];
      return {validation: false, module: 'email', typeError: error};
    } else if (passwordInput.errors){
      error = Object.keys(passwordInput.errors)[0];
      return {validation: false, module: 'password', typeError: error};
    }

    return {validation: true};
  }

  async presentToast(message: string, color: string) {
    if (this.currentToast) {
      this.currentToast.remove();
      this.currentToast = null;
    }

    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color,
    });

    this.currentToast = toast;
    await toast.present();

    toast.onDidDismiss().then(() => {
      if (this.currentToast === toast) { 
        this.currentToast = null;
      }
    });
  }

  goBackLogin() {
    this.navCtrl.navigateBack('/login');
  }
}
