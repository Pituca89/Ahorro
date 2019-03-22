import { Component } from '@angular/core';
import { Platform, NavController, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  constructor(
    private alertController: AlertController,
    private platform: Platform
    ) {}

    
}
