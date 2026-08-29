import { Injectable } from '@angular/core';

import { STORAGE_KEYS } from '../constants/storage.constants';
import { AuthResponse, User } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class TokenService {
  saveSession(response: AuthResponse, persistent = true): void {
    const storage = persistent ? localStorage : sessionStorage;
    this.clearSession();

    storage.setItem(STORAGE_KEYS.accessToken, response.accessToken);
    storage.setItem(STORAGE_KEYS.refreshToken, response.refreshToken);
    storage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(response.user));
  }

  getAccessToken(): string | null {
    return this.read(STORAGE_KEYS.accessToken);
  }

  getRefreshToken(): string | null {
    return this.read(STORAGE_KEYS.refreshToken);
  }

  getCurrentUser(): User | null {
    const value = this.read(STORAGE_KEYS.currentUser);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as User;
    } catch {
      return null;
    }
  }

  clearSession(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  private read(key: string): string | null {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key);
  }
}
