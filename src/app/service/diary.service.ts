import { Injectable } from '@angular/core';

export interface DiaryEntry {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DiaryService {
  private entries: DiaryEntry[] = [];
  private nextId = 1;
  private readonly STORAGE_KEY = 'diary_entries';

  constructor() {
    // Load entries from LocalStorage when service initializes
    this.loadFromLocalStorage();
  }

  getEntries(): DiaryEntry[] {
    return this.entries;
  }

  addEntry(entry: Omit<DiaryEntry, 'id' | 'createdAt'>): DiaryEntry {
    const newEntry: DiaryEntry = {
      id: this.nextId++,
      title: entry.title,
      content: entry.content,
      createdAt: new Date()
    };
    this.entries.push(newEntry);
    this.saveToLocalStorage(); // Save to LocalStorage after adding
    return newEntry;
  }

  getEntryById(id: number): DiaryEntry | undefined {
    return this.entries.find(e => e.id === id);
  }

  deleteEntry(id: number): void {
    this.entries = this.entries.filter(e => e.id !== id);
    this.saveToLocalStorage(); // Save to LocalStorage after deleting
  }

  /**
   * Save all entries to LocalStorage
   */
  private saveToLocalStorage(): void {
    try {
      const dataToSave = {
        entries: this.entries,
        nextId: this.nextId
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving to LocalStorage:', error);
      // Handle quota exceeded error or other storage errors
    }
  }

  /**
   * Load entries from LocalStorage
   */
  private loadFromLocalStorage(): void {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);

        // Convert date strings back to Date objects
        this.entries = parsed.entries.map((entry: any) => ({
          ...entry,
          createdAt: new Date(entry.createdAt)
        }));

        // Restore the nextId to continue from where we left off
        this.nextId = parsed.nextId || 1;
      }
    } catch (error) {
      console.error('Error loading from LocalStorage:', error);
      // If there's an error, start with empty array
      this.entries = [];
      this.nextId = 1;
    }
  }
}
