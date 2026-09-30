import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrivateTeacherService } from '../../../../core/services/private-teacher.service';
import { PrivateTeacherOverview } from '../../../../core/models/private-teacher.model';

@Component({
  selector: 'app-private-teacher',
  templateUrl: './private-teacher.component.html',
  styleUrls: ['./private-teacher.component.scss']
})
export class PrivateTeacherComponent implements OnInit {
  overview: PrivateTeacherOverview | null = null;
  loading = true;
  error = false;

  constructor(private readonly service: PrivateTeacherService, private readonly router: Router) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = false;
    this.service.overview().subscribe({
      next: response => { this.overview = response.data; this.loading = false; },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  back(): void { this.router.navigateByUrl('/teacher'); }
}
