import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderDocument, WorkOrderStatus } from '../../models/work-order.models';

@Component({
  selector: 'app-work-order-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="bar"
    [style.background]="style.background"
    [style.border]="style.border"
    [class.menu-open]="isOpen">

    <span class="bar-name">{{ order.data.name }}</span>
    <span class="bar-status"
      [style.color]="style.color"
      [style.background]="style.badgeBg"
      [style.border]="style.badgeBorder">
      {{ statusLabel }}
    </span>
    <span class="menu-btn" (click)="toggleMenu($event)">⋯</span>
  </div>

  <div class="dropdown" [style.display]="isOpen ? 'block' : 'none'">
    <button (click)="onEdit($event)">Edit</button>
    <button class="delete-btn" (click)="onDelete($event)">Delete</button>
  </div>
`,
  styleUrl: './work-order-bar.scss'
})
export class WorkOrderBar {
  @Input() order!: WorkOrderDocument;
  @Output() edit = new EventEmitter<WorkOrderDocument>();
  @Output() delete = new EventEmitter<string>();

  @HostBinding('style.position') position = 'absolute';
  @HostBinding('style.top') top = '5px';
  @HostBinding('style.height') height = '38px';
  @HostBinding('style.z-index') get zIndex() { return this.isOpen ? '100' : '3'; }

  isOpen = false;

  readonly STATUS_STYLES: Record<WorkOrderStatus, { background: string; border: string; color: string; badgeBg: string; badgeBorder: string }> = {
    'open': {
      background: 'rgba(241, 254, 255, 1)',
      border: '1px solid rgba(206, 251, 255, 1)',
      color: '#0891b2',
      badgeBg: 'rgba(228, 253, 255, 1)',
      badgeBorder: '1px solid rgba(206, 251, 255, 1)'
    },
    'in-progress': {
      background: 'rgba(237, 238, 255, 1)',
      border: '1px solid rgba(222, 224, 255, 1)',
      color: '#3E40DB',
      badgeBg: 'rgba(214, 216, 255, 1)',
      badgeBorder: '1px solid rgba(222, 224, 255, 1)'
    },
    'complete': {
      background: 'rgba(248, 255, 243, 1)',
      border: '1px solid rgba(209, 250, 179, 1)',
      color: '#08A268',
      badgeBg: 'rgba(225, 255, 204, 1)',
      badgeBorder: '1px solid rgba(209, 250, 179, 1)'
    },
    'blocked': {
      background: 'rgba(255, 252, 241, 1)',
      border: '1px solid rgba(255, 245, 207, 1)',
      color: '#B13600',
      badgeBg: 'rgba(252, 238, 181, 1)',
      badgeBorder: '1px solid rgba(255, 245, 207, 1)'
    }
  };

  readonly STATUS_LABELS: Record<WorkOrderStatus, string> = {
    'open': 'Open',
    'in-progress': 'In Progress',
    'complete': 'Complete',
    'blocked': 'Blocked'
  };

  get style() { return this.STATUS_STYLES[this.order.data.status]; }
  get statusLabel() { return this.STATUS_LABELS[this.order.data.status]; }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  onEdit(event: MouseEvent) {
    event.stopPropagation();
    this.isOpen = false;
    this.edit.emit(this.order);
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.isOpen = false;
    this.delete.emit(this.order.docId);
  }
}