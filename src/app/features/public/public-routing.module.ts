import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './pages/landing/landing.component';
import { ArchitectureComponent } from './pages/architecture/architecture.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'architecture',
    component: ArchitectureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}
