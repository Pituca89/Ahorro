import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform, NavController ,AlertController, LoadingController} from '@ionic/angular';
import { Storage } from '@ionic/storage';


var actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: 'http://localhost/',
  
  handleCodeInApp: true,
  
  iOS: {
    bundleId: "com.example.ios"
  },
  android: {
    packageName: "io.ionic.starter",
    installApp: true,
    minimumVersion: "12"
  }

};

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.page.html',
  styleUrls: ['./google-login.page.scss'],
})



export class GoogleLoginPage implements OnInit{


  //user: Observable<firebase.User>;
  user: any;
  success: boolean = false;
  email_verified:boolean = true;
  normalUser = {
    mail:'',
    pass:''
  }
  oobCode: String;
  mode: String;
  apiKey:String
  constructor(
              private afAuth: AngularFireAuth, 
              private gplus: GooglePlus,
              private platform: Platform,
              private router: Router,
              private navCtrl: NavController,
              private alertController: AlertController,
              private storage: Storage,
              private loadingController: LoadingController,
              private activatedRoute: ActivatedRoute,
              ) {
                this.user = this.afAuth.authState;
                
              }   

    ngOnInit(){
      const queryParams = this.activatedRoute.snapshot.queryParams;
      this.mode = queryParams['mode'];
      this.apiKey = queryParams['apiKey'];
      this.oobCode = queryParams['oobCode'];
      
    }          

    async ingresarUsuario(){
      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
      await loading.present();
      if(this.normalUser.mail != '' && this.normalUser.pass != ''){
        this.afAuth.auth.signInWithEmailAndPassword(this.normalUser.mail,this.normalUser.pass)
        .then(()=>{
          var user_ver = firebase.auth().currentUser;
          this.email_verified = user_ver.emailVerified;

          if(this.email_verified){
            loading.dismiss();
            this.user = {
              name: this.normalUser.mail,
              email: this.normalUser.mail,
              picture: "/src/assets/img/user_icon.png"
            }
            this.storage.set('data_user',this.user);
            this.navCtrl.navigateRoot(['/tabs'])
            this.router.navigate(['/tabs'])
          }else{
            this.faltaVerificacion();
            loading.dismiss();
          }
          
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
        .then(() => {
          this.success = true;
          var user_ver = firebase.auth().currentUser;
          this.email_verified = user_ver.emailVerified;
          user_ver.sendEmailVerification()
          .then(function(){
            console.log("verification success")
            loading.dismiss();
          }).catch(function(err){
            console.log(err)
            loading.dismiss();
          });
        },error => {
          console.log(error)          
          if(error.message == 'Password should be at least 6 characters'){
            this.ContraseñaInvalida();
          }
          if(error.message == 'The email address is already in use by another account.'){
            this.UsuarioRegistrado();
          }
          loading.dismiss();
        })    

      }else{
        loading.dismiss();
        alert("Debe completar los campos!");
      }
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

    async faltaVerificacion() {
      const alert = await this.alertController.create({
        header: 'Error!',
        message: '<strong>Falta Verificacion!</strong>',
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
    async ContraseñaInvalida() {
      const alert = await this.alertController.create({
        header: 'Error!',
        message: '<strong>Contraseña Invalida</strong>',
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

    async UsuarioRegistrado() {
      const alert = await this.alertController.create({
        header: 'Error!',
        message: '<strong>El mail ingresado se encuentra en uso</strong>',
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

    /**Login Google */
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
          this.storage.set('data_user',this.user)
          .then(()=>{
            this.navCtrl.navigateRoot(['/tabs'])
            this.router.navigate(['/tabs'])
          },error =>{
            console.log(error)
          }) 
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
        const credential = await this.afAuth.auth.signInWithPopup(provider)
        .then(()=>{
          this.navCtrl.navigateRoot(['/tabs'])
          this.router.navigate(['/tabs'])
        },error =>{
          console.log(error)
        }) 
        
      } catch(err) {
        console.log(err)
      }
      loading.dismiss();
    }
    
    googleLogin() {
      if (this.platform.is('cordova')) {
        this.nativeGoogleLogin()         
      } else {
        this.webGoogleLogin()                
      }
    }
   
    signOut() {
      this.afAuth.auth.signOut();
      if (this.platform.is('cordova')) {
        this.gplus.logout();
      } 
    }
    
}
