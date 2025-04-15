import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DiaryEntry, DiaryService } from '../service/diary.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss']
})
export class DiaryComponent {
  entries: DiaryEntry[] = [];
  title: string = '';
  content: string = '';

  constructor(private diaryService: DiaryService) {
    this.entries = this.diaryService.getEntries();
  }

  addEntry(): void {
    if (this.title.trim() && this.content.trim()) {
      this.diaryService.addEntry({ title: this.title, content: this.content });
      this.title = '';
      this.content = '';
      this.entries = this.diaryService.getEntries();
    }
  }

  deleteEntry(id: number): void {
    this.diaryService.deleteEntry(id);
    this.entries = this.diaryService.getEntries();
  }
}
