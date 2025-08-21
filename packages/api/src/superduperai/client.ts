// @ts-nocheck
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from '@turbo-super/core';

export class SuperDuperAIClient {
  private client: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL: API_ENDPOINTS.SUPERDUPERAI_BASE_URL,
      timeout: 30000,
      ...config,
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use((config) => {
      // Add auth headers if needed
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle common errors
        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<T>(config);
    return response.data;
  }

  // Get the underlying axios instance
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Export default instance
export const superDuperAIClient = new SuperDuperAIClient();
