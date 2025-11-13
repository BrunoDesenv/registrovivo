import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, tap, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface DiaryResponse {
  success: boolean;
  message?: string;
  entry?: DiaryEntry;
  entries?: DiaryEntry[];
}

@Injectable({
  providedIn: 'root'
})
export class DiaryService {
  private apiUrl = `${environment.apiUrl}/diary`;
  private entries: DiaryEntry[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get all diary entries for the current user
   */
  getEntries(): Observable<DiaryEntry[]> {
    const username = this.authService.getCurrentUsername();

    if (!username) {
      console.error('No user logged in');
      return of([]);
    }

    const params = new HttpParams().set('username', username);

    return this.http.get<DiaryResponse>(this.apiUrl, { params }).pipe(
      map(response => {
        if (response.success && response.entries) {
          // Convert date strings to Date objects
          this.entries = response.entries.map(entry => ({
            ...entry,
            createdAt: new Date(entry.createdAt)
          }));
          return this.entries;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching entries:', error);
        return of([]);
      })
    );
  }

  /**
   * Get entries from memory (for compatibility with existing code)
   */
  getEntriesSync(): DiaryEntry[] {
    return this.entries;
  }

  /**
   * Add a new diary entry
   */
  addEntry(entry: Omit<DiaryEntry, 'id' | 'createdAt'>): Observable<DiaryEntry | null> {
    const username = this.authService.getCurrentUsername();

    if (!username) {
      console.error('No user logged in');
      return of(null);
    }

    return this.http.post<DiaryResponse>(this.apiUrl, {
      username,
      title: entry.title,
      content: entry.content
    }).pipe(
      map(response => {
        if (response.success && response.entry) {
          const newEntry: DiaryEntry = {
            id: response.entry.id,
            title: response.entry.title,
            content: response.entry.content,
            createdAt: new Date(response.entry.createdAt)
          };
          // Add to local cache
          this.entries.unshift(newEntry);
          return newEntry;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error adding entry:', error);
        return of(null);
      })
    );
  }

  /**
   * Get a single entry by ID
   */
  getEntryById(id: string): Observable<DiaryEntry | null> {
    const username = this.authService.getCurrentUsername();

    if (!username) {
      console.error('No user logged in');
      return of(null);
    }

    const params = new HttpParams().set('username', username);

    return this.http.get<DiaryResponse>(`${this.apiUrl}/${id}`, { params }).pipe(
      map(response => {
        if (response.success && response.entry) {
          return {
            ...response.entry,
            createdAt: new Date(response.entry.createdAt)
          };
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching entry:', error);
        return of(null);
      })
    );
  }

  /**
   * Get entry by ID from memory (for compatibility)
   */
  getEntryByIdSync(id: string): DiaryEntry | undefined {
    return this.entries.find(e => e.id === id);
  }

  /**
   * Delete a diary entry
   */
  deleteEntry(id: string): Observable<boolean> {
    const username = this.authService.getCurrentUsername();

    if (!username) {
      console.error('No user logged in');
      return of(false);
    }

    const params = new HttpParams().set('username', username);

    return this.http.delete<DiaryResponse>(`${this.apiUrl}/${id}`, { params }).pipe(
      tap(response => {
        if (response.success) {
          // Remove from local cache
          this.entries = this.entries.filter(e => e.id !== id);
        }
      }),
      map(response => response.success),
      catchError(error => {
        console.error('Error deleting entry:', error);
        return of(false);
      })
    );
  }
}
