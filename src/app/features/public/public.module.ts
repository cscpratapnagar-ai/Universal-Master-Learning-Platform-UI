import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { PublicRoutingModule } from './public-routing.module';
import { LandingComponent } from './pages/landing/landing.component';

@NgModule({
  declarations: [LandingComponent],
  imports: [SharedModule, PublicRoutingModule]
})
export class PublicModule {}
