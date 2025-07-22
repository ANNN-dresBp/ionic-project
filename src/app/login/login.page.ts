import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule, ToastController, NavController} from '@ionic/angular';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
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

  constructor( private formBuilder: FormBuilder, private toastController: ToastController, private authService: AuthService, private navCtrl: NavController) {
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

      await this.presentToast(messageToShow, 'danger');
    } else {
      const loginErrorMessage = '';
      this.authService.loginUser(credentials).then(res =>  {
        this.navCtrl.navigateForward('/home');
        console.log(res);
      }).catch(async (error) => {
        await this.presentToast('Credenciales incorrectas', 'danger');
      });
      // console.log('Credenciales válidas:', credentials);
      // await this.presentToast('Inicio de sesión exitoso', 'success');
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
}
