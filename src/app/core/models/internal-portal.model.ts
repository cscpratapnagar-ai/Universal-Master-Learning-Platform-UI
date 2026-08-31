export interface InternalPortalOverview {
  status: string;
  service: string;
  timestamp: string;
  totalUsers: number;
  activeUsers: number;
  totalOrganizations: number;
  activeOrganizations: number;
  usersByRole: Record<string, number>;
  newUsersLast30Days: number;
  newOrganizationsLast30Days: number;
}
