import { Component } from '@angular/core';
import { DiaryComponent } from "./diary/diary.component";

@Component({
  selector: 'app-root',
  imports: [DiaryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'registrovivo';
}
