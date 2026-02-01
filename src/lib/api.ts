// ============================================================================
// BACKEND API SERVICE
// ============================================================================
// This replaces the Supabase client with direct backend API calls
// All authentication and data operations go through our secure backend
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// ============================================================================
// API CLIENT CONFIGURATION
// ============================================================================

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private loadToken(): void {
    this.token = localStorage.getItem('qthink_solutions_token');
  }

  private saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('qthink_solutions_token', token);
  }

  private clearToken(): void {
    this.token = null;
    localStorage.removeItem('qthink_solutions_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(data.message || 'Request failed', response.status, data);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred', 500);
    }
  }

  // ============================================================================
  // AUTHENTICATION METHODS
  // ============================================================================

  async signup(userData: UserSignupData): Promise<AuthResponse> {
    const response = await this.request<{ user: User; token: string }>('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data?.token) {
      this.saveToken(response.data.token);
    }

    return {
      status: response.status,
      message: response.message || 'Signup successful',
      data: response.data
    };
  }



  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<{ user: User; token: string }>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data?.token) {
      this.saveToken(response.data.token);
    }

    return {
      status: response.status,
      message: response.message || 'Login successful',
      data: response.data
    };
  }

  async logout(): Promise<void> {
    try {
      await this.request('/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  async verifyToken(): Promise<ApiResponse<{ user: User }>> {
    return this.request('/verify-token');
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await this.request<{ user: User; token: string }>('/refresh-token', {
      method: 'POST',
    });

    if (response.data?.token) {
      this.saveToken(response.data.token);
    }

    return {
      status: response.status,
      message: response.message || 'Token refreshed',
      data: response.data
    };
  }

  // ============================================================================
  // USER METHODS
  // ============================================================================

  async getUserProfile(): Promise<ApiResponse<{ profile: User }>> {
    return this.request('/user/profile');
  }

  async updateUserProfile(profileData: Partial<User>): Promise<ApiResponse<{ profile: User }>> {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: ChangePasswordData): Promise<ApiResponse<{ message: string }>> {
    return this.request('/user/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  async getUserEnrollments(): Promise<ApiResponse<{ enrollments: EnrollmentWithTraining[] }>> {
    return this.request('/user/enrollments');
  }

  async createEnrollment(trainingId: string): Promise<ApiResponse<{ enrollment: EnrollmentWithTraining }>> {
    return this.request('/user/enrollments', {
      method: 'POST',
      body: JSON.stringify({ training_id: trainingId }),
    });
  }

  async getUserPayments(): Promise<ApiResponse<{ payments: PaymentWithTraining[] }>> {
    return this.request('/user/payments');
  }

  async createPayment(paymentData: CreatePaymentData): Promise<ApiResponse<{ payment: Payment }>> {
    return this.request('/user/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getUserCertificates(): Promise<ApiResponse<{ certificates: CertificateWithTraining[] }>> {
    return this.request('/user/certificates');
  }

  async getTrainingPrograms(): Promise<ApiResponse<{ programs: TrainingProgram[] }>> {
    return this.request('/user/training-programs');
  }

  async getTrainingProgramDetails(id: string): Promise<ApiResponse<{ program: TrainingProgram }>> {
    return this.request(`/user/training-programs/${id}`);
  }

  async getUserDashboard(): Promise<ApiResponse<{ dashboard: UserDashboard }>> {
    return this.request('/user/dashboard');
  }

  // ============================================================================
  // ADMIN METHODS
  // ============================================================================

  async getAdminProfile(): Promise<ApiResponse<{ profile: User }>> {
    return this.request('/admin/profile');
  }

  async getAllUsers(filters?: UserFilters): Promise<ApiResponse<{ users: User[]; count: number }>> {
    const queryParams = new URLSearchParams();
    if (filters?.role) queryParams.append('role', filters.role);
    if (filters?.profession) queryParams.append('profession', filters.profession);
    if (filters?.search) queryParams.append('search', filters.search);

    const query = queryParams.toString();
    return this.request(`/admin/users${query ? `?${query}` : ''}`);
  }

  async getUserById(id: string): Promise<ApiResponse<{ user: User }>> {
    return this.request(`/admin/users/${id}`);
  }

  async updateUserRole(id: string, roleData: UpdateUserRoleData): Promise<ApiResponse<{ user: User }>> {
    return this.request(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
  }

  async getAllTrainingPrograms(): Promise<ApiResponse<{ programs: TrainingProgram[]; count: number }>> {
    return this.request('/admin/training-programs');
  }

  async createTrainingProgram(programData: CreateTrainingProgramData): Promise<ApiResponse<{ program: TrainingProgram }>> {
    return this.request('/admin/training-programs', {
      method: 'POST',
      body: JSON.stringify(programData),
    });
  }

  async updateTrainingProgram(id: string, programData: Partial<CreateTrainingProgramData>): Promise<ApiResponse<{ program: TrainingProgram }>> {
    return this.request(`/admin/training-programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(programData),
    });
  }

  async deleteTrainingProgram(id: string): Promise<ApiResponse<{ program: TrainingProgram }>> {
    return this.request(`/admin/training-programs/${id}`, {
      method: 'DELETE',
    });
  }

  async getAllEnrollments(filters?: EnrollmentFilters): Promise<ApiResponse<{ enrollments: AdminEnrollment[]; count: number }>> {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.userId) queryParams.append('userId', filters.userId);

    const query = queryParams.toString();
    return this.request(`/admin/enrollments${query ? `?${query}` : ''}`);
  }

  async updateEnrollmentStatus(id: string, status: EnrollmentStatus): Promise<ApiResponse<{ enrollment: Enrollment }>> {
    return this.request(`/admin/enrollments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getAllPayments(filters?: PaymentFilters): Promise<ApiResponse<{ payments: AdminPayment[]; count: number }>> {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.userId) queryParams.append('userId', filters.userId);

    const query = queryParams.toString();
    return this.request(`/admin/payments${query ? `?${query}` : ''}`);
  }

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<ApiResponse<{ payment: Payment }>> {
    return this.request(`/admin/payments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async createCertificate(certificateData: CreateCertificateData): Promise<ApiResponse<{ certificate: Certificate }>> {
    return this.request('/admin/certificates', {
      method: 'POST',
      body: JSON.stringify(certificateData),
    });
  }

  async getAllCertificates(filters?: CertificateFilters): Promise<ApiResponse<{ certificates: AdminCertificate[]; count: number }>> {
    const queryParams = new URLSearchParams();
    if (filters?.userId) queryParams.append('userId', filters.userId);
    if (filters?.trainingId) queryParams.append('trainingId', filters.trainingId);

    const query = queryParams.toString();
    return this.request(`/admin/certificates${query ? `?${query}` : ''}`);
  }

  async getAdminActivityLogs(filters?: ActivityLogFilters): Promise<ApiResponse<{ logs: AdminActivityLog[]; count: number }>> {
    const queryParams = new URLSearchParams();
    if (filters?.adminId) queryParams.append('adminId', filters.adminId);
    if (filters?.action) queryParams.append('action', filters.action);

    const query = queryParams.toString();
    return this.request(`/admin/activity-logs${query ? `?${query}` : ''}`);
  }

  async getAdminDashboard(): Promise<ApiResponse<{ dashboard: AdminDashboard }>> {
    return this.request('/admin/dashboard');
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getCurrentToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: ValidationError[];
}

export interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  value: any;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: number;
  profession?: 'student' | 'professional';
  college?: string;
  company?: string;
  role: 'user' | 'admin';
  is_admin: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  price?: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  enrolled_count?: number;
}

export interface Enrollment {
  id: string;
  user_id: string;
  training_id: string;
  status: EnrollmentStatus;
  created_at: string;
  updated_at?: string;
}

export interface Payment {
  id: string;
  user_id: string;
  training_id: string;
  amount: number;
  payment_method: string;
  transaction_reference?: string;
  status: PaymentStatus;
  created_at: string;
  updated_at?: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  training_id: string;
  certificate_id: string;
  issue_date: string;
  file_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface AdminActivityLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  created_at: string;
  admin_name?: string;
  admin_email?: string;
}

// Extended types for frontend display
export interface EnrollmentWithTraining extends Enrollment {
  training_id: string;
  training_title: string;
  training_description?: string;
  duration?: string;
  price?: number;
}

export interface PaymentWithTraining extends Payment {
  training_id: string;
  training_title: string;
}

export interface CertificateWithTraining extends Certificate {
  training_id: string;
  training_title: string;
}

export interface AdminEnrollment extends Enrollment {
  user_id: string;
  full_name: string;
  email: string;
  training_id: string;
  training_title: string;
  price?: number;
}

export interface AdminPayment extends Payment {
  user_id: string;
  full_name: string;
  email: string;
  training_id: string;
  training_title: string;
}

export interface AdminCertificate extends Certificate {
  user_id: string;
  full_name: string;
  email: string;
  training_id: string;
  training_title: string;
}

// Request data types
export interface UserSignupData {
  full_name: string;
  email: string;
  password: string;
  phone?: number;
  profession?: 'student' | 'professional';
  college?: string;
  company?: string;
}

export interface AdminSignupData {
  full_name: string;
  email: string;
  password: string;
  adminSecret: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface CreatePaymentData {
  training_id: string;
  amount: number;
  payment_method: string;
  transaction_reference?: string;
}

export interface UpdateUserRoleData {
  role?: 'user' | 'admin';
  is_admin?: boolean;
}

export interface CreateTrainingProgramData {
  title: string;
  description?: string;
  duration?: string;
  price?: number;
  is_active?: boolean;
}

export interface CreateCertificateData {
  user_id: string;
  training_id: string;
  issue_date: string;
  file_url?: string;
}

// Filter types
export interface UserFilters {
  role?: 'user' | 'admin';
  profession?: 'student' | 'professional';
  search?: string;
}

export interface EnrollmentFilters {
  status?: EnrollmentStatus;
  userId?: string;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  userId?: string;
}

export interface CertificateFilters {
  userId?: string;
  trainingId?: string;
}

export interface ActivityLogFilters {
  adminId?: string;
  action?: string;
}

// Status types
export type EnrollmentStatus = 'pending_payment' | 'enrolled' | 'completed';
export type PaymentStatus = 'pending_verification' | 'verified' | 'failed' | 'refunded';

// Dashboard types
export interface UserDashboard {
  stats: {
    total_enrollments: number;
    completed_programs: number;
    pending_payments: number;
    total_certificates: number;
  };
  recent_enrollments: EnrollmentWithTraining[];
  recent_payments: PaymentWithTraining[];
  recent_certificates: CertificateWithTraining[];
}

export interface AdminDashboard {
  stats: {
    total_users: number;
    total_admins: number;
    total_programs: number;
    active_programs: number;
    total_enrollments: number;
    pending_payments: number;
    total_certificates: number;
  };
  recent_users: User[];
  recent_enrollments: AdminEnrollment[];
  recent_payments: AdminPayment[];
}

// ============================================================================
// EXPORT API CLIENT INSTANCE
// ============================================================================

export const apiClient = new ApiClient(API_BASE_URL);

// For backward compatibility, export the same structure as before
export const api = {
  auth: {
    signup: (data: UserSignupData) => apiClient.signup(data),

    login: (credentials: LoginCredentials) => apiClient.login(credentials),
    logout: () => apiClient.logout(),
    verifyToken: () => apiClient.verifyToken(),
    refreshToken: () => apiClient.refreshToken(),
    changePassword: (data: ChangePasswordData) => apiClient.changePassword(data),
  },
  user: {
    getProfile: () => apiClient.getUserProfile(),
    updateProfile: (data: Partial<User>) => apiClient.updateUserProfile(data),
    getEnrollments: () => apiClient.getUserEnrollments(),
    createEnrollment: (trainingId: string) => apiClient.createEnrollment(trainingId),
    getPayments: () => apiClient.getUserPayments(),
    createPayment: (data: CreatePaymentData) => apiClient.createPayment(data),
    getCertificates: () => apiClient.getUserCertificates(),
    getTrainingPrograms: () => apiClient.getTrainingPrograms(),
    getTrainingProgramDetails: (id: string) => apiClient.getTrainingProgramDetails(id),
    getDashboard: () => apiClient.getUserDashboard(),
  },
  admin: {
    getProfile: () => apiClient.getAdminProfile(),
    getAllUsers: (filters?: UserFilters) => apiClient.getAllUsers(filters),
    getUserById: (id: string) => apiClient.getUserById(id),
    updateUserRole: (id: string, data: UpdateUserRoleData) => apiClient.updateUserRole(id, data),
    getAllTrainingPrograms: () => apiClient.getAllTrainingPrograms(),
    createTrainingProgram: (data: CreateTrainingProgramData) => apiClient.createTrainingProgram(data),
    updateTrainingProgram: (id: string, data: Partial<CreateTrainingProgramData>) => apiClient.updateTrainingProgram(id, data),
    deleteTrainingProgram: (id: string) => apiClient.deleteTrainingProgram(id),
    getAllEnrollments: (filters?: EnrollmentFilters) => apiClient.getAllEnrollments(filters),
    updateEnrollmentStatus: (id: string, status: EnrollmentStatus) => apiClient.updateEnrollmentStatus(id, status),
    getAllPayments: (filters?: PaymentFilters) => apiClient.getAllPayments(filters),
    updatePaymentStatus: (id: string, status: PaymentStatus) => apiClient.updatePaymentStatus(id, status),
    createCertificate: (data: CreateCertificateData) => apiClient.createCertificate(data),
    getAllCertificates: (filters?: CertificateFilters) => apiClient.getAllCertificates(filters),
    getActivityLogs: (filters?: ActivityLogFilters) => apiClient.getAdminActivityLogs(filters),
    getDashboard: () => apiClient.getAdminDashboard(),
  },
  // Direct access methods for convenience
  getUserEnrollments: async () => {
    const response = await apiClient.getUserEnrollments();
    return response.data?.enrollments || [];
  },
  getUserCertificates: async () => {
    const response = await apiClient.getUserCertificates();
    return response.data?.certificates || [];
  },
  updateUserProfile: async (data: Partial<User>) => {
    const response = await apiClient.updateUserProfile(data);
    return response.data?.profile;
  },
  getTrainingPrograms: async () => {
    const response = await apiClient.getTrainingPrograms();
    return response.data?.programs || [];
  }
};

export default apiClient;