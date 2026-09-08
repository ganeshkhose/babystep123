export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
  createdAt?: string;
  isGuest?: boolean;
}
