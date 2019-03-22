import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { GooglePlus } from '@ionic-native/google-plus/ngx'; // We'll install this in the next section
import { GoogleLoginPageModule } from './google-login/google-login.module'
import { TabsPageModule } from './tabs/tabs.module';

const firebaseConfig = {
    apiKey: "AIzaSyCEDtQTBbXDoUKKcCSHTcAfWWLWlYlb9e0",
    authDomain: "my-project-1549735769834.firebaseapp.com",
    databaseURL: "https://my-project-1549735769834.firebaseio.com",
    projectId: "my-project-1549735769834",
    storageBucket: "my-project-1549735769834.appspot.com",
    messagingSenderId: "55212604977"
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig), // <-- firebase here
    AngularFireAuthModule,
    GoogleLoginPageModule,
    TabsPageModule
  ],
  providers: [
    GooglePlus,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
