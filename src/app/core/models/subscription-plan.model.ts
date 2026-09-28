export interface SubscriptionPlan {
  code: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  features: Record<string, string>;
}
