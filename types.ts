// types.ts

export enum Role {
  ADMINISTRATOR = 'Administrator',
  FINANCE_MANAGER = 'Finance Manager',
  INVENTORY_CLERK = 'Inventory Clerk',
  TECHNICIAN = 'Technician',
  PURCHASING_OFFICER = 'Purchasing Officer'
}

export enum JobStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  QUALITY_CHECK = 'QC',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export enum StockStatus {
  IN_STOCK = 'In Stock',
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
}

export interface JobOrder {
  id: string;
  customer: string;
  vehicle: string;
  description: string;
  status: JobStatus;
  technicianId: string;
  estimatedCost: number;
  dateCreated: string;
  progress: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minLevel: number;
  price: number;
  location: string;
  lastRestock: string;
}

export interface PurchaseOrder {
  id: string;
  vendor: string;
  amount: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Received';
  date: string;
  items: string[];
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
}

export interface KPIMetric {
  label: string;
  value: string;
  trend: number; // percentage
  trendUp: boolean;
}