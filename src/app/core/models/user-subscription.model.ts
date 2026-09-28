export interface UserSubscription {
  planCode: string;
  planName: string;
  status: string;
  billingCycle: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  active: boolean;
}
