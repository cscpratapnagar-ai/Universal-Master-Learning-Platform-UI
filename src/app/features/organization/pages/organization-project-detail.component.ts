import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService, OrganizationProjectDetail } from '../../../core/services/organization.service';

@Component({
  selector: 'app-organization-project-detail',
  templateUrl: './organization-project-detail.component.html',
  styleUrls: ['./organization-project-detail.component.scss']
})
export class OrganizationProjectDetailComponent implements OnInit {
  project: OrganizationProjectDetail | null = null;
  loading = true;
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly organization: OrganizationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const id = this.route.snapshot.paramMap.get('programId');
    if (!id) {
      this.error = 'Project identifier is missing.';
      this.loading = false;
      return;
    }
    this.loading = true;
    this.error = '';
    this.organization.getProgramDetail(id).subscribe({
      next: response => { this.project = response.data || null; this.loading = false; },
      error: error => {
        this.error = error?.error?.message || 'Unable to load this project.';
        this.loading = false;
      }
    });
  }

  back(): void { void this.router.navigate(['/organization']); }
}
