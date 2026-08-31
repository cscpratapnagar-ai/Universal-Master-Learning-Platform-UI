import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../../core/services/organization.service';
import {
  CreateOrganizationRequest,
  Organization,
  OrganizationProfile,
  OrganizationStatus,
  UpdateOrganizationRequest
} from '../../../../core/models/organization.model';

type StatusFilter = 'ALL' | OrganizationStatus;

@Component({
  selector: 'app-organization-management',
  templateUrl: './organization-management.component.html',
  styleUrls: ['./organization-management.component.scss']
})
export class OrganizationManagementComponent implements OnInit {
  organizations: Organization[] = [];
  profiles = new Map<string, OrganizationProfile>();
  filtered: Organization[] = [];

  loading = true;
  saving = false;
  errorMessage = '';
  search = '';
  statusFilter: StatusFilter = 'ALL';

  showCreate = false;
  showEdit = false;
  showDetails = false;
  editing: Organization | null = null;
  selected: OrganizationProfile | null = null;

  form: CreateOrganizationRequest = { code: '', name: '', description: '' };
  editForm: UpdateOrganizationRequest = { name: '', description: '' };

  constructor(private readonly organizationService: OrganizationService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';

    this.organizationService.getAll().subscribe({
      next: response => {
        this.organizations = response.data || [];
        this.loadProfiles();
      },
      error: error => {
        this.errorMessage = error.message || 'Unable to load organizations';
        this.loading = false;
      }
    });
  }

  private loadProfiles(): void {
    if (!this.organizations.length) {
      this.profiles.clear();
      this.applyFilter();
      this.loading = false;
      return;
    }

    let remaining = this.organizations.length;
    this.profiles.clear();

    this.organizations.forEach(org => {
      this.organizationService.getProfile(org.id).subscribe({
        next: response => {
          if (response.data) this.profiles.set(org.id, response.data);
          this.finishProfileLoad(--remaining);
        },
        error: () => this.finishProfileLoad(--remaining)
      });
    });
  }

  private finishProfileLoad(remaining: number): void {
    if (remaining === 0) {
      this.applyFilter();
      this.loading = false;
    }
  }

  applyFilter(): void {
    const query = this.search.toLowerCase().trim();

    this.filtered = this.organizations.filter(org => {
      const profile = this.profiles.get(org.id);
      const status = profile?.status || (org.active ? 'ACTIVE' : 'INACTIVE');

      const matchesQuery =
        !query ||
        org.name.toLowerCase().includes(query) ||
        org.code.toLowerCase().includes(query) ||
        (org.description || '').toLowerCase().includes(query);

      const matchesStatus = this.statusFilter === 'ALL' || status === this.statusFilter;
      return matchesQuery && matchesStatus;
    });
  }

  create(): void {
    const payload = {
      code: this.form.code.trim().toUpperCase().replace(/\s+/g, '_'),
      name: this.form.name.trim(),
      description: this.form.description?.trim() || ''
    };

    if (!payload.code || !payload.name) return;

    this.saving = true;
    this.organizationService.create(payload).subscribe({
      next: () => {
        this.saving = false;
        this.showCreate = false;
        this.form = { code: '', name: '', description: '' };
        this.load();
      },
      error: error => {
        this.saving = false;
        this.errorMessage = error.message || 'Unable to create organization';
      }
    });
  }

  openEdit(org: Organization): void {
    this.editing = org;
    this.editForm = {
      name: org.name,
      description: org.description || ''
    };
    this.showEdit = true;
  }

  closeEdit(): void {
    this.showEdit = false;
    this.editing = null;
  }

  update(): void {
    if (!this.editing || !this.editForm.name.trim()) return;

    this.saving = true;
    this.organizationService.update(this.editing.id, {
      name: this.editForm.name.trim(),
      description: this.editForm.description?.trim() || ''
    }).subscribe({
      next: () => {
        this.saving = false;
        this.closeEdit();
        this.load();
      },
      error: error => {
        this.saving = false;
        this.errorMessage = error.message || 'Unable to update organization';
      }
    });
  }

  openDetails(org: Organization): void {
    this.selected = null;
    this.showDetails = true;

    this.organizationService.getProfile(org.id).subscribe({
      next: response => this.selected = response.data || this.fallbackProfile(org),
      error: () => this.selected = this.fallbackProfile(org)
    });
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selected = null;
  }

  private fallbackProfile(org: Organization): OrganizationProfile {
    return {
      ...org,
      status: org.active ? 'ACTIVE' : 'INACTIVE'
    };
  }

  statusOf(org: Organization): OrganizationStatus {
    return this.profiles.get(org.id)?.status || (org.active ? 'ACTIVE' : 'INACTIVE');
  }

  changeStatus(org: Organization, status: OrganizationStatus): void {
    const current = this.statusOf(org);
    if (current === status) return;

    const label = status.charAt(0) + status.slice(1).toLowerCase();
    if (!confirm(`Change ${org.name} status to ${label}?`)) return;

    this.saving = true;
    this.organizationService.updateStatus(org.id, status).subscribe({
      next: response => {
        if (response.data) this.profiles.set(org.id, response.data);
        this.saving = false;
        this.applyFilter();
        if (this.selected?.id === org.id) this.selected = response.data || this.selected;
      },
      error: error => {
        this.saving = false;
        this.errorMessage = error.message || 'Unable to update organization status';
      }
    });
  }

  deactivate(org: Organization): void {
    if (!confirm(`Deactivate ${org.name}? This will remove tenant access until it is reactivated.`)) return;

    this.organizationService.deactivate(org.id).subscribe({
      next: () => this.load(),
      error: error => this.errorMessage = error.message || 'Unable to deactivate organization'
    });
  }

  trackById(_: number, org: Organization): string {
    return org.id;
  }

  get activeCount(): number {
    return this.organizations.filter(org => this.statusOf(org) === 'ACTIVE').length;
  }

  get suspendedCount(): number {
    return this.organizations.filter(org => this.statusOf(org) === 'SUSPENDED').length;
  }

  get archivedCount(): number {
    return this.organizations.filter(org => this.statusOf(org) === 'ARCHIVED').length;
  }

  get statusOptions(): OrganizationStatus[] {
    return ['ACTIVE', 'SUSPENDED', 'INACTIVE', 'ARCHIVED', 'DRAFT'];
  }
}