import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZoomLevel } from '../timeline/timeline';

@Component({
  selector: 'app-timeline-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-header.html',
  styleUrl: './timeline-header.scss'
})
export class TimelineHeader {
  @Input() zoom: ZoomLevel = 'day';
  @Output() zoomChange = new EventEmitter<ZoomLevel>();

  dropdownOpen = false;

  zoomOptions = [
    { value: 'hour' as ZoomLevel, label: 'Hour' },
    { value: 'day' as ZoomLevel, label: 'Day' },
    { value: 'week' as ZoomLevel, label: 'Week' },
    { value: 'month' as ZoomLevel, label: 'Month' },
  ];

  get currentLabel() {
    return this.zoomOptions.find(o => o.value === this.zoom)?.label ?? 'Day';
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(value: ZoomLevel) {
    this.zoomChange.emit(value);
    this.dropdownOpen = false;
  }
}