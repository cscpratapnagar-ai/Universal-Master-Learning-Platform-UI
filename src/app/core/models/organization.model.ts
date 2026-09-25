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

export interface OrganizationOverview {
  organizationId: string;
  organizationName: string;
  organizationCode: string;
  status: OrganizationStatus;
  active: boolean;
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  archivedCourses: number;
}

export interface OrganizationProgram { id: string; title: string; slug?: string | null; description?: string | null; status: string; organizationId: string; }

export interface OrganizationCourse {
  id: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  status: string;
  organizationId: string;
}

export interface CreateOrganizationRequest { code: string; name: string; description?: string; }
export interface UpdateOrganizationRequest { name: string; description?: string; }

export type OrganizationProfileUpdate = Partial<Omit<OrganizationProfile,'id' | 'code' | 'name' | 'description' | 'active' | 'status'>>;

export interface OrganizationMember {
  id: string;
  userId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  active: boolean;
  roles?: string[];
}


export interface OrganizationProjectCourse {
  id: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  status: string;
  sortOrder: number;
  organizationId?: string | null;
}

export interface OrganizationProjectPath {
  id: string;
  title: string;
  description?: string | null;
  courses: OrganizationProjectCourse[];
}

export interface OrganizationProjectDetail {
  id: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  status: string;
  organizationId?: string | null;
  learningPathCount: number;
  courseCount: number;
  learningPaths: OrganizationProjectPath[];
  milestones?: OrganizationProjectMilestone[];
}

export interface OrganizationProjectMilestone {
  id: string;
  programId: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  sortOrder: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'CANCELLED' | string;
}
