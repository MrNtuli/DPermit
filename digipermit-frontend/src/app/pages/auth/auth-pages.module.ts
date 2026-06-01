import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProfilePage } from './profile.page';
import { AuthChildRoutingModule } from './auth-child-routing.module';

@NgModule({
  declarations: [ProfilePage],
  imports: [SharedModule, AuthChildRoutingModule],
})
export class AuthPagesModule {}
