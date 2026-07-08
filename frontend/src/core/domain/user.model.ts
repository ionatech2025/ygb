export type UserRole = 'ADMIN' | 'DATA_COLLECTOR';
export type AccountStatus = 'ACTIVE' | 'DEACTIVATED';
export type AuthChannel = 'ONLINE' | 'OFFLINE';

// 1. Pure type definition (Completely erasable at compile time)
export type UgandaPhoneNumber = string;

// 2. Pure functional Domain Service to handle the invariant check
export function parseAndValidateUgandaPhone(value: string): UgandaPhoneNumber {
  const clean = value.replace(/\s+/g, '');
  
  // Standard validation rule for Uganda MTN/Airtel structural prefixes
  const ugandaPhoneRegex = /^(07[0-9]{8}|\+2567[0-9]{8}|2567[0-9]{8})$/;
  
  if (!ugandaPhoneRegex.test(clean)) {
    throw new Error('Invalid Uganda phone number format. Use format: 07XXXXXXXX');
  }
  
  return clean as UgandaPhoneNumber;
}

// Aggregate Root
export interface User {
  id: string;
  fullName: string;
  phoneNumber: UgandaPhoneNumber; 
  role: UserRole;
  status: AccountStatus;
  createdByAdminId: string; 
}

// Domain Event Records
export interface UserAuthenticatedEvent {
  userId: string;
  channel: AuthChannel;
  timestamp: string;
}