export interface ManagedUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  enabled: boolean;
  roles: string[];
}

export interface UpdateUserStatusRequest { enabled: boolean; }
export interface UpdateUserRolesRequest { roles: string[]; }