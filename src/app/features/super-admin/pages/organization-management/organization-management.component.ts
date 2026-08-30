import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../../core/services/organization.service';
import { CreateOrganizationRequest, Organization, UpdateOrganizationRequest } from '../../../../core/models/organization.model';

@Component({
  selector: 'app-organization-management',
  templateUrl: './organization-management.component.html',
  styleUrls: ['./organization-management.component.scss']
})
export class OrganizationManagementComponent implements OnInit {
  organizations: Organization[] = [];
  filtered: Organization[] = [];
  loading = true;
  errorMessage = '';
  search = '';
  showCreate = false;
  showEdit = false;
  saving = false;
  editing: Organization | null = null;

  form: CreateOrganizationRequest = { code: '', name: '', description: '' };
  editForm: UpdateOrganizationRequest = { code: '', name: '', description: '' };

  constructor(private readonly organizationService: OrganizationService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.organizationService.getAll().subscribe({
      next: response => {
        this.organizations = response.data || [];
        this.applyFilter();
        this.loading = false;
      },
      error: error => {
        this.errorMessage = error.message || 'Unable to load organizations';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const query = this.search.toLowerCase().trim();
    this.filtered = this.organizations.filter(org =>
      !query ||
      org.name.toLowerCase().includes(query) ||
      org.code.toLowerCase().includes(query) ||
      (org.description || '').toLowerCase().includes(query)
    );
  }

  create(): void {
    if (!this.form.code.trim() || !this.form.name.trim()) return;
    this.saving = true;
    this.organizationService.create(this.form).subscribe({
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
      code: org.code,
      name: org.name,
      description: org.description || '',
      active: org.active
    };
    this.showEdit = true;
  }

  update(): void {
    if (!this.editing || !this.editForm.code.trim() || !this.editForm.name.trim()) return;
    this.saving = true;
    this.organizationService.update(this.editing.id, this.editForm).subscribe({
      next: () => {
        this.saving = false;
        this.showEdit = false;
        this.editing = null;
        this.load();
      },
      error: error => {
        this.saving = false;
        this.errorMessage = error.message || 'Unable to update organization';
      }
    });
  }

  deactivate(org: Organization): void {
    if (!confirm(`Deactivate ${org.name}?`)) return;
    this.organizationService.deactivate(org.id).subscribe({
      next: () => this.load(),
      error: error => this.errorMessage = error.message || 'Unable to update organization'
    });
  }

  trackById(_: number, org: Organization): string { return org.id; }
  get activeCount(): number { return this.organizations.filter(org => org.active).length; }
  get inactiveCount(): number { return this.organizations.length - this.activeCount; }
}
