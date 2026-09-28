import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionPlan } from '../../../../core/models/subscription-plan.model';
import { SubscriptionPlanService } from '../../../../core/services/subscription-plan.service';
import { BillingOrderResponse, UserSubscriptionService } from '../../../../core/services/user-subscription.service';

declare global {
  interface Window { Razorpay: any; }
}

@Component({
  selector: 'app-billing-checkout',
  templateUrl: './billing-checkout.component.html',
  styleUrls: ['./billing-checkout.component.scss']
})
export class BillingCheckoutComponent implements OnInit {
  plans: SubscriptionPlan[] = [];
  selectedCode = 'PRO';
  cycle: 'MONTHLY' | 'YEARLY' = 'MONTHLY';
  loading = true;
  paying = false;
  error = '';
  message = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly plansService: SubscriptionPlanService,
    private readonly billing: UserSubscriptionService
  ) {}

  ngOnInit(): void {
    this.selectedCode = this.route.snapshot.queryParamMap.get('plan')?.toUpperCase() || 'PRO';
    this.cycle = (this.route.snapshot.queryParamMap.get('cycle')?.toUpperCase() === 'YEARLY' ? 'YEARLY' : 'MONTHLY');
    this.plansService.getPlans().subscribe({
      next: response => { this.plans = response.data || []; this.loading = false; },
      error: () => { this.error = 'Plans could not be loaded.'; this.loading = false; }
    });
  }

  get selected(): SubscriptionPlan | undefined {
    return this.plans.find(plan => plan.code === this.selectedCode);
  }

  price(plan: SubscriptionPlan): number {
    return this.cycle === 'YEARLY' ? plan.yearlyPrice : plan.monthlyPrice;
  }

  choose(code: string): void {
    this.selectedCode = code;
    this.message = '';
    this.error = '';
  }

  checkout(): void {
    const plan = this.selected;
    if (!plan || this.paying) return;
    if (this.price(plan) <= 0) {
      this.router.navigateByUrl('/auth/register');
      return;
    }
    this.paying = true;
    this.error = '';
    this.message = '';

    this.billing.createOrder(plan.code, this.cycle).subscribe({
      next: response => this.openRazorpay(response.data),
      error: err => {
        this.error = err?.error?.message || err?.message || 'Checkout could not be started.';
        this.paying = false;
      }
    });
  }

  private openRazorpay(order: BillingOrderResponse): void {
    if (!window.Razorpay) {
      this.error = 'Payment checkout is unavailable. Please refresh and try again.';
      this.paying = false;
      return;
    }

    const checkout = new window.Razorpay({
      key: order.gatewayKeyId,
      amount: Math.round(order.amount * 100),
      currency: order.currency,
      name: 'Universal Master Learning Platform',
      description: order.planName + ' · ' + order.billingCycle,
      order_id: order.gatewayOrderId,
      handler: (response: any) => {
        this.billing.verifyPayment(order.orderId, {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature
        }).subscribe({
          next: () => {
            this.message = 'Payment verified. Your subscription is now active.';
            this.paying = false;
          },
          error: err => {
            this.error = err?.error?.message || 'Payment completed but verification is still pending. Please wait for webhook confirmation.';
            this.paying = false;
          }
        });
      },
      modal: { ondismiss: () => this.paying = false },
      theme: { color: '#536dfe' }
    });

    checkout.on('payment.failed', (response: any) => {
      this.error = response?.error?.description || 'Payment failed. Please try again.';
      this.paying = false;
    });

    checkout.open();
  }

  back(): void { this.router.navigateByUrl('/learner'); }
}
