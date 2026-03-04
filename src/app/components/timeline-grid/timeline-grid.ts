import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkCenterDocument, WorkOrderDocument } from '../../models/work-order.models';
import { WorkOrderBar } from '../work-order-bar/work-order-bar';
import { ZoomLevel } from '../timeline/timeline';

@Component({
  selector: 'app-timeline-grid',
  standalone: true,
  imports: [CommonModule, WorkOrderBar],
  templateUrl: './timeline-grid.html',
  styleUrl: './timeline-grid.scss'
})
export class TimelineGrid implements OnChanges {
  @Input() zoom: ZoomLevel = 'day';
  @Input() workCenters: WorkCenterDocument[] = [];
  @Input() workOrders: WorkOrderDocument[] = [];
  @Input() activeWorkCenterId: string | null = null;
  @Output() timelineClick = new EventEmitter<{ date: string; workCenterId: string }>();
  @Output() editOrder = new EventEmitter<WorkOrderDocument>();
  @Output() deleteOrder = new EventEmitter<string>();


  columns: Date[] = [];
  today = new Date();
  todayOffset = 0;

  readonly COLUMN_WIDTHS: Record<ZoomLevel, number> = {
    hour: 80,
    day: 60,
    week: 160,
    month: 400
  };

  get columnWidth() { return this.COLUMN_WIDTHS[this.zoom]; }

  ngOnChanges() {
    this.generateColumns();
    this.todayOffset = this.getDateOffset(new Date());
  }

 hoveredRowId: string | null = null;
mouseX = 0;

onRowMouseMove(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.closest('app-work-order-bar')) {
    this.hoveredRowId = null;
    return;
  }
  const row = event.currentTarget as HTMLElement;
  const rect = row.getBoundingClientRect();
  this.mouseX = event.clientX - rect.left;
}

  generateColumns() {
    const cols: Date[] = [];
    const today = new Date();

    if (this.zoom === 'hour') {
      for (let i = -24; i <= 48; i++) {
        const d = new Date(today);
        d.setHours(today.getHours() + i);
        cols.push(d);
      }
    } else if (this.zoom === 'day') {
      for (let i = -30; i <= 60; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        cols.push(d);
      }
    } else if (this.zoom === 'week') {
      for (let i = -8; i <= 16; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i * 7);
        cols.push(d);
      }
    } else {
      for (let i = -6; i <= 12; i++) {
        const d = new Date(today);
        d.setMonth(today.getMonth() + i);
        d.setDate(1);
        cols.push(d);
      }
    }

    this.columns = cols;
  }

  formatColumnHeader(date: Date): string {
    if (this.zoom === 'hour') {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    } else if (this.zoom === 'day') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (this.zoom === 'week') {
      return 'W' + this.getWeekNumber(date) + ' ' + date.toLocaleDateString('en-US', { month: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  }

  getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  getTodayOffset(): number {
    return this.getDateOffset(new Date());
  }

  getDateOffset(date: Date): number {
    const start = this.columns[0];
    const diffMs = date.getTime() - start.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (this.zoom === 'hour') return diffDays * 24 * this.columnWidth;
    if (this.zoom === 'day') return diffDays * this.columnWidth;
    if (this.zoom === 'week') return (diffDays / 7) * this.columnWidth;
    return (diffDays / 30.44) * this.columnWidth;
  }

  getBarLeft(startDate: string): number {
    return this.getDateOffset(new Date(startDate + 'T00:00:00'));
  }

  getBarWidth(startDate: string, endDate: string): number {
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    if (this.zoom === 'hour') return Math.max(diffDays * 24 * this.columnWidth, 60);
    if (this.zoom === 'day') return Math.max(diffDays * this.columnWidth, 60);
    if (this.zoom === 'week') return Math.max((diffDays / 7) * this.columnWidth, 60);
    return Math.max((diffDays / 30.44) * this.columnWidth, 60);
  }

  getOrdersForCenter(workCenterId: string): WorkOrderDocument[] {
    return this.workOrders.filter(o => o.data.workCenterId === workCenterId);
  }

  onRowClick(event: MouseEvent, workCenterId: string) {
    const target = event.target as HTMLElement;
    if (target.closest('app-work-order-bar')) return;

    const row = (event.currentTarget as HTMLElement);
    const rect = row.getBoundingClientRect();
    const scrollLeft = row.closest('.grid-scroll')?.scrollLeft ?? 0;
    const clickX = event.clientX - rect.left + scrollLeft;

    const clickedDate = this.getDateFromOffset(clickX);
    this.activeWorkCenterId = workCenterId;
    this.timelineClick.emit({ date: clickedDate, workCenterId });
  }

  getDateFromOffset(offsetX: number): string {
    const start = this.columns[0];
    let daysFromStart = 0;

    if (this.zoom === 'hour') daysFromStart = offsetX / this.columnWidth / 24;
    else if (this.zoom === 'day') daysFromStart = offsetX / this.columnWidth;
    else if (this.zoom === 'week') daysFromStart = (offsetX / this.columnWidth) * 7;
    else daysFromStart = (offsetX / this.columnWidth) * 30.44;

    const result = new Date(start);
    result.setDate(start.getDate() + Math.floor(daysFromStart));
    return result.toISOString().split('T')[0];
  }

  get totalWidth(): number {
    return this.columns.length * this.columnWidth;
  }

  isToday(date: Date): boolean {
    const t = new Date();
    if (this.zoom === 'hour') {
      return date.getHours() === t.getHours() &&
        date.getDate() === t.getDate() &&
        date.getMonth() === t.getMonth();
    }
    return date.getDate() === t.getDate() &&
      date.getMonth() === t.getMonth() &&
      date.getFullYear() === t.getFullYear();
  }
}