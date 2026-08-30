import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [CommonModule, FormsModule, RouterModule]
})
export class SharedModule {}
