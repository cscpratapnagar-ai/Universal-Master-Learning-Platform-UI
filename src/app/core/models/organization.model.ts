export interface Organization {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  active: boolean;
}

export interface CreateOrganizationRequest {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateOrganizationRequest {
  code: string;
  name: string;
  description?: string;
  active?: boolean;
}
