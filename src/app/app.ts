import { Component } from '@angular/core';
import { Timeline } from './components/timeline/timeline';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Timeline],
  template: `<app-timeline></app-timeline>`,
  styles: [`
  :host { display: block; height: 100vh; }
`]
})
export class App {}