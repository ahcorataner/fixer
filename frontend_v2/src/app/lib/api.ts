// API Client para comunicação com o backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro na requisição');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // KPIs / Dashboard
  async getKPIs() {
    return this.request<{
      mtbf_hours: number;
      mttr_hours: number;
      availability_percent: number;
    }>('/kpis');
  }

  async getAssetsByStatus() {
    return this.request<Array<{ status: string; total: number }>>('/dashboard/assets-by-status');
  }

  async getRecentMaintenances() {
    return this.request<Array<any>>('/dashboard/recent-maintenances');
  }

  // Assets
  async getAssets() {
    return this.request<Array<any>>('/assets');
  }

  async getAsset(id: number) {
    return this.request<any>(`/assets/${id}`);
  }

  async createAsset(data: any) {
    return this.request<any>('/assets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAsset(id: number, data: any) {
    return this.request<any>(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAsset(id: number) {
    return this.request<any>(`/assets/${id}`, {
      method: 'DELETE',
    });
  }

  // Work Orders
  async getWorkOrders() {
    return this.request<Array<any>>('/work-orders');
  }

  async getWorkOrder(id: number) {
    return this.request<any>(`/work-orders/${id}`);
  }

  async createWorkOrder(data: any) {
    return this.request<any>('/work-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWorkOrderStatus(id: number, status: string, reason?: string) {
    return this.request<any>(`/work-orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  }

  // Maintenance History
  async getMaintenanceHistory() {
    return this.request<Array<any>>('/maintenance-history');
  }

  async createMaintenanceHistory(data: any) {
    return this.request<any>('/maintenance-history', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Users
  async getUsers() {
    return this.request<Array<any>>('/users');
  }

  async getTechnicians() {
    return this.request<Array<any>>('/users/technicians');
  }

  // Health Check
  async healthCheck() {
    return this.request<{ status: string; database: string }>('/health');
  }
}

export const api = new ApiClient(API_URL);
