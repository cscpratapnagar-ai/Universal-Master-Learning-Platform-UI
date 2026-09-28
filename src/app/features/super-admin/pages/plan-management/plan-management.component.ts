import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionPlan } from '../../../../core/models/subscription-plan.model';
import { SubscriptionPlanService } from '../../../../core/services/subscription-plan.service';

@Component({
  selector: 'app-plan-management',
  templateUrl: './plan-management.component.html',
  styleUrls: ['./plan-management.component.scss']
})
export class PlanManagementComponent implements OnInit {
  plans: SubscriptionPlan[] = [];
  selected: SubscriptionPlan | null = null;
  loading = true;
  saving = false;
  message = '';
  error = '';

  constructor(
    private readonly plansService: SubscriptionPlanService,
    private readonly router: Router
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.plansService.getAdminPlans().subscribe({
      next: response => { this.plans = response.data ?? []; this.loading = false; },
      error: (err: Error) => { this.error = err.message || 'Unable to load plans.'; this.loading = false; }
    });
  }

  featureEntriesFor(plan: SubscriptionPlan): string[] {
    return Object.entries(plan.features ?? {}).map(([code, value]) => value === 'true' ? code.replace(/_/g, ' ') : code.replace(/_/g, ' ') + ': ' + value);
  }

  edit(plan: SubscriptionPlan): void {
    this.selected = { ...plan, features: { ...plan.features } };
    this.message = '';
  }

  close(): void { this.selected = null; }

  featureEntries(): Array<{code:string;value:string}> {
    return Object.entries(this.selected?.features ?? {}).map(([code, value]) => ({ code, value }));
  }

  updateFeature(code: string, value: string): void {
    if (!this.selected) return;
    this.selected.features = { ...this.selected.features, [code]: value };
  }

  save(): void {
    if (!this.selected || this.saving) return;
    this.saving = true;
    this.message = '';
    this.error = '';
    this.plansService.updateAdminPlan(this.selected.code, this.selected).subscribe({
      next: response => {
        const updated = response.data;
        this.plans = this.plans.map(plan => plan.code === updated.code ? updated : plan);
        this.selected = { ...updated, features: { ...updated.features } };
        this.message = 'Plan updated successfully.';
        this.saving = false;
      },
      error: (err: Error) => { this.error = err.message || 'Unable to update plan.'; this.saving = false; }
    });
  }

  back(): void { this.router.navigateByUrl('/super-admin'); }
}