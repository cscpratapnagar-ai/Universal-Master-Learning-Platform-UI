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

export interface OrganizationProjectDependency {
  id: string; programId: string; predecessorId: string; predecessorTitle: string; successorId: string; successorTitle: string; type: string;
}

export interface OrganizationProjectCourseProgress { courseId: string; title: string; progressPercent: number; enrollmentCount: number; completedEnrollmentCount: number; }
export interface OrganizationProjectPathProgress { pathId: string; title: string; courseCount: number; progressPercent: number; }
export interface OrganizationProjectProgress { programId: string; courseCount: number; pathCount: number; learnerCount: number; enrollmentCount: number; projectProgressPercent: number; courses: OrganizationProjectCourseProgress[]; learningPaths: OrganizationProjectPathProgress[]; }

export interface OrganizationProjectHealth { programId: string; healthScore: number; healthStatus: 'HEALTHY' | 'ATTENTION' | 'AT_RISK' | string; learningProgressPercent: number; milestoneCompletionPercent: number; deadlineHealthPercent: number; blockerHealthPercent: number; milestoneCount: number; completedMilestoneCount: number; blockedMilestoneCount: number; overdueMilestoneCount: number; dependencyCount: number; generatedAt: string; }

export interface OrganizationProjectTimelineItem { id: string; title: string; description?: string | null; status: string; dueDate?: string | null; sortOrder: number; overdue: boolean; }

export interface OrganizationProjectActivity { id: string; action: string; details?: string | null; actor: string; createdAt: string; }
