import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Type declaration for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private recognition: any;
  private isListening = false;
  public finalTranscript$ = new Subject<string>();
  public interimTranscript$ = new Subject<string>();
  public isListening$ = new Subject<boolean>();
  public error$ = new Subject<string>();

  constructor() {
    // Initialize Speech Recognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true; // Keep listening until stopped
      this.recognition.interimResults = true; // Get results as we speak
      this.recognition.lang = 'pt-BR'; // Portuguese Brazil - change if needed

      this.setupRecognitionHandlers();
    } else {
      console.error('Speech Recognition API not supported in this browser');
    }
  }

  private setupRecognitionHandlers(): void {
    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Emit final and interim results separately
      if (finalTranscript) {
        this.finalTranscript$.next(finalTranscript);
        this.interimTranscript$.next(''); // Clear interim when we have final
      } else if (interimTranscript) {
        this.interimTranscript$.next(interimTranscript);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.error$.next(event.error);

      if (event.error === 'no-speech' || event.error === 'aborted') {
        // Auto-restart on certain errors
        if (this.isListening) {
          this.start();
        }
      }
    };

    this.recognition.onend = () => {
      // Auto-restart if we're still supposed to be listening
      if (this.isListening) {
        this.recognition.start();
      } else {
        this.isListening$.next(false);
      }
    };
  }

  start(): void {
    if (!this.recognition) {
      this.error$.next('Speech Recognition not supported');
      return;
    }

    if (!this.isListening) {
      this.isListening = true;
      this.isListening$.next(true);
      this.recognition.start();
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.isListening$.next(false);
      this.recognition.stop();
    }
  }

  isRecognitionSupported(): boolean {
    return !!this.recognition;
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}
