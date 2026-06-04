import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ProfilePage } from './profile.page';
import { AuthChildRoutingModule } from './auth-child-routing.module';

@NgModule({
  declarations: [ProfilePage],
  imports: [SharedModule, ReactiveFormsModule, AuthChildRoutingModule],
})
export class AuthPagesModule {}
