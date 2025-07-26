import { IonicModule, ToastController, NavController} from '@ionic/angular';

export class Alerts {
  private currentToast: HTMLIonToastElement | null = null;
  constructor (private toastController: ToastController) {}
  async presentToast(message: string, color: string) {
    if (this.currentToast) {
      this.currentToast.remove();
      this.currentToast = null;
    }

    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
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