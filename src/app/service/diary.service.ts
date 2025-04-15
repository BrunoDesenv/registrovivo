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
    return newEntry;
  }

  getEntryById(id: number): DiaryEntry | undefined {
    return this.entries.find(e => e.id === id);
  }

  deleteEntry(id: number): void {
    this.entries = this.entries.filter(e => e.id !== id);
  }
}
