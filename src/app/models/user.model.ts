export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'employee';
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  employee?: any; // Can be expanded to Employee interface if needed
}

export interface AuthResponse {
  token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: 'admin' | 'supervisor' | 'employee';
}

export interface LoginRequest {
  email: string;
  password: string;
  extended_token?: boolean;
}