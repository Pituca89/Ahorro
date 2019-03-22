import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Storage } from '@ionic/storage';
import { Platform, NavController, NavParams ,AlertController, LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  user:any;
  userReady: boolean = false;
  constructor(
    private nativeStorage: NativeStorage,
    private afAuth: AngularFireAuth, 
    private gplus: GooglePlus,
    private platform: Platform,
    private router: Router,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private storage: Storage
    ) {}

    async ngOnInit() {
      
      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
      await loading.present();
      this.storage.get('data_user')
      .then(val => {
        this.user = {
          name: val.name,
          picture: val.picture,
          email: val.email
        }
        this.userReady = true
        loading.dismiss();
      },error => {
        console.log(error);
      }) 
      loading.dismiss();
    }

    signOut() {
      this.afAuth.auth.signOut();
      if (this.platform.is('cordova')) {
        this.gplus.logout();
      } 
      this.storage.remove('data_user');
      this.navCtrl.navigateRoot(['/login']);
      this.router.navigate(["/login"]);
    }

 
}
