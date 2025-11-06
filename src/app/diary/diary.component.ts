import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DiaryEntry, DiaryService } from '../service/diary.service';
import { CommonModule } from '@angular/common';
import { SpeechRecognitionService } from '../service/speech-recognition.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss']
})
export class DiaryComponent implements OnDestroy {
  entries: DiaryEntry[] = [];
  title: string = '';
  content: string = '';
  isListeningTitle = false;
  isListeningContent = false;
  isSpeechSupported = false;
  private subscriptions: Subscription[] = [];
  private activeField: 'title' | 'content' | null = null;
  private interimText: string = '';

  // Computed properties for display (includes interim text)
  get displayTitle(): string {
    if (this.activeField === 'title' && this.interimText) {
      return this.title + this.interimText;
    }
    return this.title;
  }

  get displayContent(): string {
    if (this.activeField === 'content' && this.interimText) {
      return this.content + this.interimText;
    }
    return this.content;
  }

  constructor(
    private diaryService: DiaryService,
    private speechService: SpeechRecognitionService
  ) {
    this.entries = this.diaryService.getEntries();
    this.isSpeechSupported = this.speechService.isRecognitionSupported();

    // Subscribe to final speech recognition results (append to field)
    this.subscriptions.push(
      this.speechService.finalTranscript$.subscribe((text: string) => {
        if (this.activeField === 'title') {
          this.title += text;
        } else if (this.activeField === 'content') {
          this.content += text;
        }
      })
    );

    // Subscribe to interim results (show temporarily, don't append)
    this.subscriptions.push(
      this.speechService.interimTranscript$.subscribe((text: string) => {
        this.interimText = text;
      })
    );

    this.subscriptions.push(
      this.speechService.isListening$.subscribe((isListening: boolean) => {
        if (this.activeField === 'title') {
          this.isListeningTitle = isListening;
        } else if (this.activeField === 'content') {
          this.isListeningContent = isListening;
        }
      })
    );

    this.subscriptions.push(
      this.speechService.error$.subscribe((error: string) => {
        console.error('Speech recognition error:', error);
        alert('Erro no reconhecimento de voz: ' + error);
      })
    );
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

  toggleSpeechRecognition(field: 'title' | 'content'): void {
    if (!this.isSpeechSupported) {
      alert('Reconhecimento de voz não é suportado neste navegador.');
      return;
    }

    const isCurrentlyListening = field === 'title' ? this.isListeningTitle : this.isListeningContent;

    if (isCurrentlyListening) {
      // Stop listening
      this.speechService.stop();
      this.activeField = null;
      this.interimText = '';
      if (field === 'title') {
        this.isListeningTitle = false;
      } else {
        this.isListeningContent = false;
      }
    } else {
      // Stop any other active listening
      if (this.isListeningTitle || this.isListeningContent) {
        this.speechService.stop();
        this.isListeningTitle = false;
        this.isListeningContent = false;
      }

      // Clear interim text and start listening for this field
      this.interimText = '';
      this.activeField = field;
      this.speechService.start();
      if (field === 'title') {
        this.isListeningTitle = true;
      } else {
        this.isListeningContent = true;
      }
    }
  }

  // Handle manual input changes
  onTitleChange(value: string): void {
    this.title = value.replace(this.interimText, '').trimEnd();
  }

  onContentChange(value: string): void {
    this.content = value.replace(this.interimText, '').trimEnd();
  }

  ngOnDestroy(): void {
    this.speechService.stop();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
