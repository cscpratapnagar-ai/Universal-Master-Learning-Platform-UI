import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { PublicRoutingModule } from './public-routing.module';
import { LandingComponent } from './pages/landing/landing.component';
import { ArchitectureComponent } from './pages/architecture/architecture.component';

@NgModule({
  declarations: [LandingComponent, ArchitectureComponent],
  imports: [SharedModule, PublicRoutingModule]
})
export class PublicModule {}
