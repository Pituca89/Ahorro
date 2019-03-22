import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform, NavController ,AlertController, LoadingController} from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.page.html',
  styleUrls: ['./google-login.page.scss'],
})
export class GoogleLoginPage {


  //user: Observable<firebase.User>;
  user: any;
  normalUser = {
    mail:'',
    pass:''
  }
  constructor(
              private afAuth: AngularFireAuth, 
              private gplus: GooglePlus,
              private nativeStorage: NativeStorage,
              private platform: Platform,
              private router: Router,
              private navCtrl: NavController,
              private alertController: AlertController,
              private storage: Storage,
              private loadingController: LoadingController
              ) {
                this.user = this.afAuth.authState;
              }   
  

    mostrarDatosUsuario(){
      alert(
        "mail: " + this.normalUser.mail + 
        " contraseña: " + this.normalUser.pass
      )
    }

    async ingresarUsuario(){
      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
      await loading.present();
      if(this.normalUser.mail != '' && this.normalUser.pass != ''){
        this.afAuth.auth.signInWithEmailAndPassword(this.normalUser.mail,this.normalUser.pass)
        .then(()=>{
          loading.dismiss();
          this.navCtrl.navigateRoot(['/tabs'])
          this.router.navigate(['/tabs'])
        },error => {
          loading.dismiss();
          this.errorUsuarioyContraseña();
        })
      }else{
        loading.dismiss();
        alert("Debe completar los campos!");
      }
    }
    async registrarUsuario(){
      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
      await loading.present();
      if(this.normalUser.mail != '' && this.normalUser.pass != ''){
        this.afAuth.auth.createUserWithEmailAndPassword(this.normalUser.mail,this.normalUser.pass)
        .then(()=>{
          loading.dismiss();
          this.navCtrl.navigateRoot(['/tabs'])
          this.router.navigate(['/tabs'])
        },error => {
          loading.dismiss();
          this.errorUsuarioyContraseña();
        })
      }else{
        loading.dismiss();
        alert("Debe completar los campos!");
      }
    }
    
    recuperarUsuario(){
    }
    async errorUsuarioyContraseña() {
      const alert = await this.alertController.create({
        header: 'Error!',
        message: '<strong>Usuario o Contraseña invalidos</strong>',
        buttons: [
          {
            text: 'Aceptar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }
        ]
      });
      await alert.present();
    }
    async nativeGoogleLogin(): Promise<void> {
      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
      await loading.present();
      try {
        //const gplusUser = 
        await this.gplus.login({
          'webClientId': '55212604977-k4narmad86gf81rf6dnj86s678vo4qhp.apps.googleusercontent.com',
          'offline': true,
          'scopes': 'profile email'
        })
        .then(data => {
          this.user = {
            name: data.displayName,
            email: data.email,
            picture: data.imageUrl
          }
          this.storage.set('data_user',this.user);
        },error => {
          console.log(error)
        })
        //return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken))
        
      } catch(err) {
        console.log(err)
      }
      loading.dismiss();
    }
    
    async webGoogleLogin(): Promise<void> {
      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
      await loading.present();
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const credential = await this.afAuth.auth.signInWithPopup(provider);
        
      } catch(err) {
        console.log(err)
      }
      loading.dismiss();
    }
    
    googleLogin() {
      if (this.platform.is('cordova')) {
        this.nativeGoogleLogin()  
        .then(()=>{
          this.navCtrl.navigateRoot(['/tabs'])
          this.router.navigate(['/tabs'])
        },error =>{
          console.log("error 1" + error)
        })
        
      } else {
        this.webGoogleLogin()        
        .then(()=>{
          this.navCtrl.navigateRoot(['/tabs'])
          this.router.navigate(['/tabs'])
        },error =>{
          console.log(error)
        })   
      }
    }
   
    signOut() {
      this.afAuth.auth.signOut();
      if (this.platform.is('cordova')) {
        this.gplus.logout();
      } 
    }
    
}
