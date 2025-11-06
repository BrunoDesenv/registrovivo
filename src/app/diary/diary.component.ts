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
  private lastInterimLength: number = 0;

  constructor(
    private diaryService: DiaryService,
    private speechService: SpeechRecognitionService
  ) {
    this.entries = this.diaryService.getEntries();
    this.isSpeechSupported = this.speechService.isRecognitionSupported();

    // Subscribe to final speech recognition results
    this.subscriptions.push(
      this.speechService.finalTranscript$.subscribe((text: string) => {
        if (this.activeField === 'title') {
          // Remove last interim text if any, then add final text
          if (this.lastInterimLength > 0) {
            this.title = this.title.slice(0, -this.lastInterimLength);
          }
          this.title += text;
          this.lastInterimLength = 0;
        } else if (this.activeField === 'content') {
          // Remove last interim text if any, then add final text
          if (this.lastInterimLength > 0) {
            this.content = this.content.slice(0, -this.lastInterimLength);
          }
          this.content += text;
          this.lastInterimLength = 0;
        }
      })
    );

    // Subscribe to interim results (replace previous interim)
    this.subscriptions.push(
      this.speechService.interimTranscript$.subscribe((text: string) => {
        if (this.activeField === 'title') {
          // Remove previous interim text
          if (this.lastInterimLength > 0) {
            this.title = this.title.slice(0, -this.lastInterimLength);
          }
          // Add new interim text
          this.title += text;
          this.lastInterimLength = text.length;
        } else if (this.activeField === 'content') {
          // Remove previous interim text
          if (this.lastInterimLength > 0) {
            this.content = this.content.slice(0, -this.lastInterimLength);
          }
          // Add new interim text
          this.content += text;
          this.lastInterimLength = text.length;
        }
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
      this.lastInterimLength = 0;
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

      // Clear interim tracking and start listening for this field
      this.lastInterimLength = 0;
      this.activeField = field;
      this.speechService.start();
      if (field === 'title') {
        this.isListeningTitle = true;
      } else {
        this.isListeningContent = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.speechService.stop();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
