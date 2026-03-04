import { WorkCenterDocument, WorkOrderDocument } from '../models/work-order.models';

export const WORK_CENTERS: WorkCenterDocument[] = [
  { docId: 'wc-1', docType: 'workCenter', data: { name: 'Extrusion Line A' } },
  { docId: 'wc-2', docType: 'workCenter', data: { name: 'CNC Machine 1' } },
  { docId: 'wc-3', docType: 'workCenter', data: { name: 'Assembly Station' } },
  { docId: 'wc-4', docType: 'workCenter', data: { name: 'Quality Control' } },
  { docId: 'wc-5', docType: 'workCenter', data: { name: 'Packaging Line' } },
];

export const WORK_ORDERS: WorkOrderDocument[] = [
  {
    docId: 'wo-1',
    docType: 'workOrder',
    data: {
      name: 'Extrusion Run 42',
      workCenterId: 'wc-1',
      status: 'complete',
      startDate: '2026-02-17',
      endDate: '2026-02-26',
    },
  },
  {
    docId: 'wo-2',
    docType: 'workOrder',
    data: {
      name: 'Extrusion Run 43',
      workCenterId: 'wc-1',
      status: 'in-progress',
      startDate: '2026-02-26',
      endDate: '2026-03-06',
    },
  },
  {
    docId: 'wo-3',
    docType: 'workOrder',
    data: {
      name: 'CNC Batch 17',
      workCenterId: 'wc-2',
      status: 'open',
      startDate: '2026-03-01',
      endDate: '2026-03-08',
    },
  },
  {
    docId: 'wo-4',
    docType: 'workOrder',
    data: {
      name: 'CNC Batch 18',
      workCenterId: 'wc-2',
      status: 'blocked',
      startDate: '2026-03-10',
      endDate: '2026-03-18',
    },
  },
  {
    docId: 'wo-5',
    docType: 'workOrder',
    data: {
      name: 'Assembly Job A',
      workCenterId: 'wc-3',
      status: 'in-progress',
      startDate: '2026-02-24',
      endDate: '2026-03-05',
    },
  },
  {
    docId: 'wo-6',
    docType: 'workOrder',
    data: {
      name: 'Assembly Job B',
      workCenterId: 'wc-3',
      status: 'open',
      startDate: '2026-03-07',
      endDate: '2026-03-14',
    },
  },
  {
    docId: 'wo-7',
    docType: 'workOrder',
    data: {
      name: 'QC Inspection 9',
      workCenterId: 'wc-4',
      status: 'blocked',
      startDate: '2026-02-20',
      endDate: '2026-03-03',
    },
  },
  {
    docId: 'wo-8',
    docType: 'workOrder',
    data: {
      name: 'Packaging Run 5',
      workCenterId: 'wc-5',
      status: 'complete',
      startDate: '2026-02-15',
      endDate: '2026-02-28',
    },
  },
  {
    docId: 'wo-9',
    docType: 'workOrder',
    data: {
      name: 'Packaging Run 6',
      workCenterId: 'wc-5',
      status: 'open',
      startDate: '2026-03-05',
      endDate: '2026-03-15',
    },
  },
];