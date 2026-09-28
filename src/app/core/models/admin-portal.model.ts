export interface AdminPortalOverview {
  status: string;
  timestamp: string;
  totalUsers: number;
  activeUsers: number;
  newUsersLast30Days: number;
  totalOrganizations: number;
  activeOrganizations: number;
  newOrganizationsLast30Days: number;
  usersByRole: Record<string, number>;
}
