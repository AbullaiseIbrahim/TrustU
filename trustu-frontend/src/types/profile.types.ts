export type Gender = 'male' | 'female' | 'other';

export type Designation =
  | 'student'
  | 'faculty'
  | 'staff'
  | 'alumni';

export interface UpdateProfilePayload {
  name?: string;
  gender?: Gender | null;
  designation?: Designation | null;
  phone?: string | null;
  email?: string | null;
  institute?: string | null;
}

export interface ProfileFormValues {
  name: string;
  gender: Gender | '';
  designation: Designation | '';
  phone: string;
  email: string;
  institute: string;
}
