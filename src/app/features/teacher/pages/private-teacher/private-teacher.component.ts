import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrivateTeacherService } from '../../../../core/services/private-teacher.service';
import { PrivateTeacherAvailability, PrivateTeacherOverview } from '../../../../core/models/private-teacher.model';

@Component({
  selector: 'app-private-teacher',
  templateUrl: './private-teacher.component.html',
  styleUrls: ['./private-teacher.component.scss']
})
export class PrivateTeacherComponent implements OnInit {
  overview: PrivateTeacherOverview | null = null;
  availability: PrivateTeacherAvailability[] = [];
  loading = true;
  saving = false;
  error = false;
  days = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
  draft = { dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '10:00', timezone: 'Asia/Kolkata' };

  constructor(private readonly service: PrivateTeacherService, private readonly router: Router) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true; this.error = false;
    this.service.overview().subscribe({next: r => {this.overview = r.data; this.loadAvailability();}, error: () => {this.error = true; this.loading = false;}});
  }

  loadAvailability(): void {
    this.service.availability().subscribe({next: r => {this.availability = r.data || []; this.loading = false;}, error: () => {this.error = true; this.loading = false;}});
  }

  addSlot(): void {
    if (this.draft.endTime <= this.draft.startTime) return;
    this.saving = true;
    this.service.addAvailability(this.draft).subscribe({next: r => {this.availability = [...this.availability, r.data]; this.saving = false;}, error: () => {this.saving = false; this.error = true;}});
  }

  back(): void { this.router.navigateByUrl('/teacher'); }
}
