import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { WorkCenterDocument, WorkOrderDocument, WorkOrderStatus } from '../../models/work-order.models';
import { WorkOrderService } from '../../services/work-order.service';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './work-order-panel.html',
  styleUrl: './work-order-panel.scss'
})
export class WorkOrderPanel implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() order: WorkOrderDocument | null = null;
  @Input() prefilledDate: string | null = null;
  @Input() prefilledWorkCenterId: string | null = null;
  @Input() workCenters: WorkCenterDocument[] = [];
  @Output() save = new EventEmitter<WorkOrderDocument>();
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(WorkOrderService);

  overlapError = false;

  statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'complete', label: 'Complete' },
    { value: 'blocked', label: 'Blocked' },
  ];

  form = this.fb.group({
    name: ['', Validators.required],
    status: ['open' as WorkOrderStatus, Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  ngOnChanges() {
    if (!this.isOpen) return;
    this.overlapError = false;

    if (this.mode === 'edit' && this.order) {
      this.form.setValue({
        name: this.order.data.name,
        status: this.order.data.status,
        startDate: this.toDisplayDate(this.order.data.startDate),
        endDate: this.toDisplayDate(this.order.data.endDate),
      });
    } else {
      const start = this.prefilledDate ?? new Date().toISOString().split('T')[0];
      const end = this.addDays(start, 7);
      this.form.setValue({
        name: '',
        status: 'open',
        startDate: this.toDisplayDate(start),
        endDate: this.toDisplayDate(end),
      });
    }
  }

  // Convert ISO to DD.MM.YYYY
  toDisplayDate(iso: string): string {
    const [y, m, d] = iso.split('-');
    return `${d}.${m}.${y}`;
  }

  // Convert DD.MM.YYYY to ISO
  toIso(display: string): string {
    const [d, m, y] = display.split('.');
    return `${y}-${m}-${d}`;
  }

  addDays(iso: string, days: number): string {
    const d = new Date(iso);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }

  onSave() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.value;
    
    let startIso: string;
    let endIso: string;
    
    try {
      startIso = this.toIso(v.startDate!);
      endIso = this.toIso(v.endDate!);
    } catch {
      this.overlapError = true;
      return;
    }

    if (startIso >= endIso) { this.overlapError = true; return; }

    const workCenterId = this.mode === 'edit' 
      ? this.order!.data.workCenterId 
      : this.prefilledWorkCenterId ?? this.workCenters[0]?.docId;

    const newOrder: WorkOrderDocument = {
      docId: this.mode === 'edit' ? this.order!.docId : this.service.generateId(),
      docType: 'workOrder',
      data: {
        name: v.name!,
        workCenterId,
        status: v.status as WorkOrderStatus,
        startDate: startIso,
        endDate: endIso,
      }
    };

    const excludeId = this.mode === 'edit' ? this.order!.docId : undefined;
    if (this.service.hasOverlap(newOrder, excludeId)) {
      this.overlapError = true;
      return;
    }

    this.save.emit(newOrder);
  }

  onClose() {
    this.close.emit();
  }
}