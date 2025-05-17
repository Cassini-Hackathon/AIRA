import { User } from './types';
import { apiRequest } from './queryClient';

// Mock authentication functions for demo purposes
// In a real application, these would interact with a real auth backend

export async function loginUser(username: string, password: string): Promise<User> {
  try {
    const response = await apiRequest('POST', '/api/auth/login', { username, password });
    const userData = await response.json();
    return userData;
  } catch (error) {
    throw new Error('Login failed. Please check your credentials.');
  }
}

export async function registerUser(userData: {
  username: string;
  password: string;
  email: string;
  fullName?: string;
}): Promise<User> {
  try {
    const response = await apiRequest('POST', '/api/auth/register', userData);
    const newUser = await response.json();
    return newUser;
  } catch (error) {
    if (error instanceof Response && error.status === 409) {
      throw new Error('Username already exists. Please choose another one.');
    }
    throw new Error('Registration failed. Please try again.');
  }
}

export async function getCurrentUser(): Promise<User | null> {
  // In a real application, this would check for a valid token and fetch the current user
  const userJson = localStorage.getItem('currentUser');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (e) {
    localStorage.removeItem('currentUser');
    return null;
  }
}

export function saveUserToStorage(user: User): void {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

export function removeUserFromStorage(): void {
  localStorage.removeItem('currentUser');
}

export function logoutUser(): void {
  removeUserFromStorage();
}
