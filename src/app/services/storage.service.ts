import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly PREFIX = 'form_builder_';

  constructor() { }

  // Save data to localStorage
  save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(
        `${this.PREFIX}${key}`, 
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Load data from localStorage
  load<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(`${this.PREFIX}${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  // Remove data from localStorage
  remove(key: string): void {
    try {
      localStorage.removeItem(`${this.PREFIX}${key}`);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  // Check if a key exists in localStorage
  exists(key: string): boolean {
    return localStorage.getItem(`${this.PREFIX}${key}`) !== null;
  }
}
