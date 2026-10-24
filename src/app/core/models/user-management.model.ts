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
export interface CreateUserRequest { email: string; temporaryPassword: string; firstName: string; lastName?: string; roles: string[]; }
