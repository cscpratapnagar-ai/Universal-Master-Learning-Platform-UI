import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-role-workspace',
  templateUrl: './role-workspace.component.html',
  styleUrls: ['./role-workspace.component.scss']
})
export class RoleWorkspaceComponent implements OnInit {
  title = 'Workspace';
  description = 'Your account has been assigned a platform role.';
  roleLabel = '';
  userEmail = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.title = this.route.snapshot.data['title'] || this.title;
    this.description = this.route.snapshot.data['description'] || this.description;
    this.roleLabel = this.route.snapshot.data['role'] || '';
    this.userEmail = this.authService.currentUser()?.email || '';
  }
}
