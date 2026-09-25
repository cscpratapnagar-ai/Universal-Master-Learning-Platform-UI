import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from '../../../core/services/organization.service';
import { OrganizationProjectDetail, OrganizationProjectMilestone } from '../../../core/models/organization.model';

@Component({
  selector: 'app-organization-project-detail',
  templateUrl: './organization-project-detail.component.html',
  styleUrls: ['./organization-project-detail.component.scss']
})
export class OrganizationProjectDetailComponent implements OnInit {
  project: OrganizationProjectDetail | null = null;
  loading = true;
  error = '';
  milestoneTitle = '';
  milestoneDescription = '';
  milestoneDueDate = '';
  milestoneSaving = false;
  milestoneAction = '';

  get milestones(): OrganizationProjectMilestone[] { return (this.project as OrganizationProjectDetail & { milestones?: OrganizationProjectMilestone[] })?.milestones || []; }

  createMilestone(): void {
    if (!this.project || !this.milestoneTitle.trim() || this.milestoneSaving) return;
    this.milestoneSaving = true; this.milestoneAction = '';
    this.organization.createMilestone(this.project.id, { title: this.milestoneTitle.trim(), description: this.milestoneDescription.trim(), dueDate: this.milestoneDueDate || undefined, sortOrder: this.milestones.length }).subscribe({
      next: () => { this.milestoneTitle=''; this.milestoneDescription=''; this.milestoneDueDate=''; this.milestoneSaving=false; this.load(); },
      error: e => { this.milestoneAction=e?.error?.message || 'Unable to create milestone.'; this.milestoneSaving=false; }
    });
  }

  milestoneTransition(m: OrganizationProjectMilestone, action: 'start'|'complete'|'block'|'reopen'|'cancel'): void {
    const calls = { start: this.organization.startMilestone, complete: this.organization.completeMilestone, block: this.organization.blockMilestone, reopen: this.organization.reopenMilestone, cancel: this.organization.cancelMilestone };
    calls[action].call(this.organization, m.id).subscribe({ next: () => this.load(), error: e => this.milestoneAction=e?.error?.message || 'Milestone action failed.' });
  }

  deleteMilestone(m: OrganizationProjectMilestone): void {
    if (m.status === 'IN_PROGRESS' || m.status === 'COMPLETED') return;
    this.organization.deleteMilestone(m.id).subscribe({ next: () => this.load(), error: e => this.milestoneAction=e?.error?.message || 'Unable to delete milestone.' });
  }

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
