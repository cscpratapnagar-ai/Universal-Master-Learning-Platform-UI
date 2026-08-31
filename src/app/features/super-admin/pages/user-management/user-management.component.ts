import { Component, OnInit } from '@angular/core';
import { ManagedUser } from '../../../../core/models/user-management.model';
import { UserManagementService } from '../../../../core/services/user-management.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: ManagedUser[] = [];
  filtered: ManagedUser[] = [];
  loading = true;
  saving = false;
  errorMessage = '';
  search = '';
  statusFilter: 'ALL' | 'ACTIVE' | 'INACTIVE' = 'ALL';
  selected: ManagedUser | null = null;
  showRoles = false;
  editableRoles: string[] = [];
  readonly availableRoles = ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT'];

  constructor(private readonly usersService: UserManagementService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    const enabled = this.statusFilter === 'ALL' ? undefined : this.statusFilter === 'ACTIVE';
    this.usersService.getAll(this.search, enabled).subscribe({
      next: response => {
        this.users = response.data || [];
        this.filtered = this.users;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = error.error?.message || error.message || 'Unable to load users';
        this.loading = false;
      }
    });
  }

  applyFilter(): void { this.load(); }

  toggleStatus(user: ManagedUser): void {
    const next = !user.enabled;
    const action = next ? 'activate' : 'deactivate';
    if (!confirm('Are you sure you want to ' + action + ' ' + user.email + '?')) return;
    this.usersService.updateStatus(user.id, { enabled: next }).subscribe({
      next: response => this.replaceUser(response.data),
      error: error => this.errorMessage = error.error?.message || 'Unable to update user status'
    });
  }

  openRoles(user: ManagedUser): void {
    this.selected = user;
    this.editableRoles = [...user.roles];
    this.showRoles = true;
  }

  toggleRole(role: string): void {
    if (this.editableRoles.includes(role)) {
      if (this.editableRoles.length === 1) return;
      this.editableRoles = this.editableRoles.filter(item => item !== role);
    } else this.editableRoles = [...this.editableRoles, role];
  }

  saveRoles(): void {
    if (!this.selected || !this.editableRoles.length) return;
    this.saving = true;
    this.usersService.updateRoles(this.selected.id, { roles: this.editableRoles }).subscribe({
      next: response => {
        this.replaceUser(response.data);
        this.saving = false;
        this.showRoles = false;
        this.selected = null;
      },
      error: error => {
        this.saving = false;
        this.errorMessage = error.error?.message || 'Unable to update user roles';
      }
    });
  }

  private replaceUser(updated: ManagedUser): void {
    const index = this.users.findIndex(user => user.id === updated.id);
    if (index >= 0) this.users[index] = updated;
    this.filtered = [...this.users];
  }

  trackById(_: number, user: ManagedUser): string { return user.id; }
  get activeCount(): number { return this.users.filter(user => user.enabled).length; }
  get inactiveCount(): number { return this.users.filter(user => !user.enabled).length; }
}