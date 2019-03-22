import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo:'login', pathMatch:'full'},
  { path: 'login', loadChildren:  './google-login/google-login.module#GoogleLoginPageModule' ,},
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' }
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
