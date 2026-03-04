import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderService } from '../../services/work-order.service';
import { WorkOrderDocument } from '../../models/work-order.models';
import { TimelineHeader } from '../timeline-header/timeline-header';
import { TimelineGrid } from '../timeline-grid/timeline-grid';
import { WorkOrderPanel } from '../work-order-panel/work-order-panel';

export type ZoomLevel = 'hour' | 'day' | 'week' | 'month';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, TimelineHeader, TimelineGrid, WorkOrderPanel],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss'
})
export class Timeline {
  private service = inject(WorkOrderService);

  zoom = signal<ZoomLevel>('day');
  panelOpen = signal(false);
  panelMode = signal<'create' | 'edit'>('create');
  selectedOrder = signal<WorkOrderDocument | null>(null);
  prefilledDate = signal<string | null>(null);
  prefilledWorkCenterId = signal<string | null>(null);
  activeWorkCenterId = signal<string | null>(null);

  get workCenters() { return this.service.getWorkCenters(); }
  get workOrders() { return this.service.getWorkOrders(); }

  onZoomChange(zoom: ZoomLevel) {
    this.zoom.set(zoom);
  }

   onTimelineClick(event: { date: string; workCenterId: string }) {
      this.prefilledDate.set(event.date);
      this.prefilledWorkCenterId.set(event.workCenterId);
      this.activeWorkCenterId.set(event.workCenterId);
      this.panelMode.set('create');
      this.selectedOrder.set(null);
      this.panelOpen.set(true);
    }

  onEdit(order: WorkOrderDocument) {
    this.selectedOrder.set(order);
    this.panelMode.set('edit');
    this.panelOpen.set(true);
  }

  onDelete(docId: string) {
    this.service.deleteWorkOrder(docId);
  }

  onPanelClose() {
    this.panelOpen.set(false);
    this.activeWorkCenterId.set(null);
  }

  onPanelSave(order: WorkOrderDocument) {
    if (this.panelMode() === 'create') {
      this.service.createWorkOrder(order);
    } else {
      this.service.updateWorkOrder(order);
    }
    this.panelOpen.set(false);
    this.activeWorkCenterId.set(null);
  }
}