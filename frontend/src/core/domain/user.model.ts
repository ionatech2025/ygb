export type UserRole = 'ADMIN' | 'DATA_COLLECTOR';

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: number;
  isActive?: boolean;
}

export interface UserPage {
  items: UserProfile[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface ResetPasswordResult {
  temporaryPassword: string;
}

// Domain Invariant: Only authenticated administrators can dispatch creation payloads
export function canUserManageAdmins(currentUserRole: UserRole | undefined): boolean {
  return currentUserRole === 'ADMIN';
}

// Domain Invariant: Enforce role isolation for PDM Survey access bounds
export function canSubmitSurvey(currentUserRole: UserRole | undefined): boolean {
  return currentUserRole === 'DATA_COLLECTOR';
}