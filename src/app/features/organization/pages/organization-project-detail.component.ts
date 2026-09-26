import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from '../../../core/services/organization.service';
import { OrganizationProjectDetail, OrganizationProjectMilestone, OrganizationProjectDependency, OrganizationProjectProgress, OrganizationProjectHealth, OrganizationProjectTimelineItem } from '../../../core/models/organization.model';

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
  dependencies: OrganizationProjectDependency[] = [];
  progress: OrganizationProjectProgress | null = null;
  progressLoading = true;
  progressError = '';
  health: OrganizationProjectHealth | null = null;
  healthLoading = true;
  healthError = '';
  timeline: OrganizationProjectTimelineItem[] = [];
  timelineLoading = true;
  timelineError = '';
  dependencyFrom = '';
  dependencyTo = '';
  dependencyAction = '';

  loadProgress(): void { if (!this.project) return; this.progressLoading = true; this.progressError = ''; this.organization.getProgramProgress(this.project.id).subscribe({ next: r => { this.progress = r.data || null; this.progressLoading = false; }, error: e => { this.progressError = e?.error?.message || 'Unable to load project learning progress.'; this.progressLoading = false; } }); }
  loadHealth(): void { if (!this.project) return; this.healthLoading = true; this.healthError = ''; this.organization.getProgramHealth(this.project.id).subscribe({ next: r => { this.health = r.data || null; this.healthLoading = false; }, error: e => { this.healthError = e?.error?.message || 'Unable to load project health intelligence.'; this.healthLoading = false; } }); }
  loadTimeline(): void { if (!this.project) return; this.timelineLoading = true; this.timelineError = ''; this.organization.getProgramTimeline(this.project.id).subscribe({ next: r => { this.timeline = r.data || []; this.timelineLoading = false; }, error: e => { this.timelineError = e?.error?.message || 'Unable to load project timeline.'; this.timelineLoading = false; } }); }
  loadDependencies(): void { if (!this.project) return; this.organization.getDependencies(this.project.id).subscribe({ next: r => this.dependencies = r.data || [], error: e => this.dependencyAction = e?.error?.message || 'Unable to load dependencies.' }); }
  createDependency(): void { if (!this.project || !this.dependencyFrom || !this.dependencyTo || this.dependencyFrom === this.dependencyTo) return; this.dependencyAction=''; this.organization.createDependency(this.project.id,{predecessorId:this.dependencyFrom,successorId:this.dependencyTo}).subscribe({next:()=>{this.dependencyFrom='';this.dependencyTo='';this.loadDependencies();},error:e=>this.dependencyAction=e?.error?.message || 'Unable to create dependency.'}); }
  deleteDependency(d: OrganizationProjectDependency): void { this.organization.deleteDependency(d.id).subscribe({next:()=>this.loadDependencies(),error:e=>this.dependencyAction=e?.error?.message || 'Unable to delete dependency.'}); }

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

  ngOnInit(): void { this.load(); }

  private refreshProjectWorkspace(): void { this.load(); this.loadDependencies(); }

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
      next: response => { this.project = response.data || null; this.loading = false; this.loadProgress(); this.loadHealth(); this.loadTimeline(); this.loadDependencies(); },
      error: error => {
        this.error = error?.error?.message || 'Unable to load this project.';
        this.loading = false;
      }
    });
  }

  back(): void { void this.router.navigate(['/organization']); }
}
