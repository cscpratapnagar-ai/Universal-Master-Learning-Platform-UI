export type OrganizationStatus = 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'ARCHIVED';

export interface Organization {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  active: boolean;
}

export interface OrganizationProfile extends Organization {
  slug?: string;
  legalName?: string;
  displayName?: string;
  organizationType?: string;
  registrationNumber?: string;
  establishedDate?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  alternatePhone?: string;
  website?: string;
  addressLine?: string;
  country?: string;
  state?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  status: OrganizationStatus;
}

export interface CreateOrganizationRequest {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateOrganizationRequest {
  name: string;
  description?: string;
}

export type OrganizationProfileUpdate = Partial<Omit<
  OrganizationProfile,
  'id' | 'code' | 'name' | 'description' | 'active' | 'status'
>>;