import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginPageContainerComponent } from './login-page.container';

const loginPageRoutes: Routes = [{ path: '', component: LoginPageContainerComponent }];

@NgModule({
  imports: [RouterModule.forChild(loginPageRoutes), SharedModule],
  declarations: [LoginFormComponent, LoginPageContainerComponent],
})
export class LoginPageModule {}
