import { Component, OnInit } from '@angular/core';
import { RoleRequest, RoleRequestService } from '../../../../core/services/role-request.service';

type RequestFilter = 'PENDING'|'APPROVED'|'REJECTED'|'ALL';

@Component({selector:'app-role-requests',templateUrl:'./role-requests.component.html',styleUrls:['./role-requests.component.scss']})
export class RoleRequestsComponent implements OnInit {
  requests: RoleRequest[] = [];
  loading = true;
  processing = '';
  error = '';
  notice = '';
  filter: RequestFilter = 'PENDING';

  constructor(private readonly service: RoleRequestService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.service.list(this.filter).subscribe({
      next: response => { this.requests = response.data || []; this.loading = false; },
      error: error => { this.error = error?.error?.message || 'Unable to load role requests.'; this.loading = false; }
    });
  }

  setFilter(filter: RequestFilter): void {
    if (this.processing) return;
    this.filter = filter;
    this.load();
  }

  approve(request: RoleRequest): void {
    if (this.processing || request.status !== 'PENDING') return;
    this.processing = request.id;
    this.error = '';
    this.service.approve(request.id).subscribe({
      next: () => {
        this.notice = request.userName + ' is now approved for ' + request.requestedRole + '.';
        this.processing = '';
        this.load();
      },
      error: error => {
        this.processing = '';
        this.error = error?.error?.message || error?.error?.error || 'Unable to approve this request.';
      }
    });
  }

  reject(request: RoleRequest): void {
    if (this.processing || request.status !== 'PENDING') return;
    const reason = window.prompt('Optional rejection reason:', '');
    if (reason === null) return;
    this.processing = request.id;
    this.error = '';
    this.service.reject(request.id, reason).subscribe({
      next: () => {
        this.notice = request.userName + ' request was rejected.';
        this.processing = '';
        this.load();
      },
      error: error => {
        this.processing = '';
        this.error = error?.error?.message || error?.error?.error || 'Unable to reject this request.';
      }
    });
  }

  trackById(_: number, request: RoleRequest): string { return request.id; }

  get pendingCount(): number { return this.requests.filter(r => r.status === 'PENDING').length; }
  get teacherCount(): number { return this.requests.filter(r => r.requestedRole === 'TEACHER' || r.requestedRole === 'INSTRUCTOR').length; }
  get organizationCount(): number { return this.requests.filter(r => r.requestedRole === 'ORG_ADMIN').length; }
  get approvedCount(): number { return this.requests.filter(r => r.status === 'APPROVED').length; }
  get rejectedCount(): number { return this.requests.filter(r => r.status === 'REJECTED').length; }
}