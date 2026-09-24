import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Organization, OrganizationOverview, OrganizationProfile, OrganizationStatus, OrganizationMember } from '../../../core/models/organization.model';
import { OrganizationService } from '../../../core/services/organization.service';

@Component({
  selector: 'app-organization-dashboard',
  templateUrl: './organization-dashboard.component.html',
  styleUrls: ['./organization-dashboard.component.scss']
})
export class OrganizationDashboardComponent implements OnInit {
  profile: OrganizationProfile | null = null;
  overview: OrganizationOverview | null = null;
  organizations: Organization[] = [];
  members: OrganizationMember[] = [];
  loading = false;
  overviewLoading = false;
  saving = false;
  memberLoading = false;
  memberSaving = false;
  error = '';
  success = '';
  memberEmail = '';
  lastRefreshedAt: Date | null = null;
  statuses: OrganizationStatus[] = ['DRAFT', 'ACTIVE', 'SUSPENDED', 'INACTIVE', 'ARCHIVED'];

  form = this.fb.group({
    organizationId: ['', Validators.required],
    slug: [''],
    legalName: [''],
    displayName: [''],
    organizationType: [''],
    registrationNumber: [''],
    establishedDate: [''],
    primaryEmail: ['', Validators.email],
    primaryPhone: [''],
    alternatePhone: [''],
    website: [''],
    addressLine: [''],
    country: [''],
    state: [''],
    city: [''],
    district: [''],
    postalCode: [''],
    logoUrl: [''],
    coverImageUrl: [''],
    primaryColor: [''],
    secondaryColor: ['']
  });

  constructor(private readonly fb: FormBuilder, private readonly org: OrganizationService) {}

  ngOnInit(): void {
    this.org.getMine().subscribe({
      next: response => {
        this.organizations = response.data || [];
        if (this.organizations.length === 1) {
          this.form.controls.organizationId.setValue(this.organizations[0].id);
          this.load();
        } else if (this.organizations.length > 1) {
          this.error = 'Select an organization workspace below.';
        } else {
          this.error = 'No organization workspace is assigned to this account yet. If your organization-admin request was just approved, sign out and sign in again once.';
        }
      },
      error: error => {
        this.error = error?.error?.message || 'Unable to load your organization workspace.';
      }
    });
  }

  selectOrganization(id: string): void {
    if (!id) return;
    this.form.controls.organizationId.setValue(id);
    this.load();
  }

  refresh(): void {
    this.load();
  }

  load(): void {
    const id = this.form.controls.organizationId.value;
    if (!id) return;

    this.loading = true;
    this.overviewLoading = true;
    this.memberLoading = true;
    this.error = '';
    this.success = '';

    this.org.getProfile(id).subscribe({
      next: response => {
        this.profile = response.data || null;
        this.loading = false;
        if (this.profile) this.form.patchValue(this.profile);
        this.lastRefreshedAt = new Date();
      },
      error: error => {
        this.error = error?.error?.message || 'Unable to load organization.';
        this.loading = false;
      }
    });

    this.org.getOverview(id).subscribe({
      next: response => {
        this.overview = response.data || null;
        this.overviewLoading = false;
        this.lastRefreshedAt = new Date();
      },
      error: error => {
        this.error = error?.error?.message || 'Unable to load organization overview.';
        this.overviewLoading = false;
      }
    });

    this.org.getMembers(id).subscribe({
      next: response => {
        this.members = response.data || [];
        this.memberLoading = false;
        this.lastRefreshedAt = new Date();
      },
      error: error => {
        this.error = error?.error?.message || 'Unable to load organization members.';
        this.memberLoading = false;
      }
    });
  }

  save(): void {
    if (!this.profile || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';
    this.success = '';
    const { organizationId, ...raw } = this.form.getRawValue();
    const body = Object.fromEntries(
      Object.entries(raw).map(([key, value]) => [key, value ?? undefined])
    );

    this.org.updateProfile(this.profile.id, body).subscribe({
      next: response => {
        this.profile = response.data || this.profile;
        this.success = 'Profile saved.';
        this.saving = false;
        this.lastRefreshedAt = new Date();
      },
      error: error => {
        this.error = error?.error?.message || 'Unable to save organization profile.';
        this.saving = false;
      }
    });
  }

  changeStatus(status: OrganizationStatus): void {
    if (!this.profile || status === this.profile.status) return;

    this.error = '';
    this.success = '';
    this.org.updateStatus(this.profile.id, status).subscribe({
      next: response => {
        this.profile = response.data || this.profile;
        this.success = 'Organization status updated.';
        this.load();
      },
      error: error => {
        this.error = error?.error?.message || 'Unable to update status.';
      }
    });
  }

  inviteMember(): void {
    if (!this.profile || !this.memberEmail.trim()) return;
    this.memberSaving = true;
    this.error = '';
    this.success = '';

    this.org.inviteMember(this.profile.id, this.memberEmail.trim()).subscribe({
      next: () => {
        this.memberEmail = '';
        this.success = 'Member invitation sent.';
        this.memberSaving = false;
        this.load();
      },
      error: error => {
        this.error = error?.error?.message || 'Unable to invite this member.';
        this.memberSaving = false;
      }
    });
  }

  deactivateMember(member: OrganizationMember): void {
    if (!this.profile) return;

    this.org.deactivateMember(this.profile.id, member.id).subscribe({
      next: () => {
        this.success = 'Member deactivated.';
        this.load();
      },
      error: error => {
        this.error = error?.error?.message || 'Unable to deactivate member.';
      }
    });
  }

  get publishedCoursePercent(): number {
    return this.coursePercent(this.overview?.publishedCourses || 0);
  }

  get draftCoursePercent(): number {
    return this.coursePercent(this.overview?.draftCourses || 0);
  }

  get archivedCoursePercent(): number {
    return this.coursePercent(this.overview?.archivedCourses || 0);
  }

  private coursePercent(value: number): number {
    const total = this.overview?.totalCourses || 0;
    return total ? Math.round((value / total) * 100) : 0;
  }
}
