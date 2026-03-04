import { Injectable, signal } from '@angular/core';
import { WorkCenterDocument, WorkOrderDocument } from '../models/work-order.models';
import { WORK_CENTERS, WORK_ORDERS } from '../data/sample-data';

@Injectable({ providedIn: 'root' })
export class WorkOrderService {
  private workCenters = signal<WorkCenterDocument[]>(WORK_CENTERS);
  private workOrders = signal<WorkOrderDocument[]>(WORK_ORDERS);

  getWorkCenters() {
    return this.workCenters();
  }

  getWorkOrders() {
    return this.workOrders();
  }

  createWorkOrder(order: WorkOrderDocument) {
    this.workOrders.update(orders => [...orders, order]);
  }

  updateWorkOrder(updated: WorkOrderDocument) {
    this.workOrders.update(orders =>
      orders.map(o => o.docId === updated.docId ? updated : o)
    );
  }

  deleteWorkOrder(docId: string) {
    this.workOrders.update(orders => orders.filter(o => o.docId !== docId));
  }

  hasOverlap(order: WorkOrderDocument, excludeId?: string): boolean {
    return this.workOrders()
      .filter(o => o.data.workCenterId === order.data.workCenterId)
      .filter(o => o.docId !== excludeId)
      .some(o =>
        order.data.startDate < o.data.endDate &&
        order.data.endDate > o.data.startDate
      );
  }

  generateId(): string {
    return 'wo-' + Date.now();
  }
}