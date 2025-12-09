import { JobOrder, JobStatus, InventoryItem, PurchaseOrder, User, Role, KPIMetric, AuditLog } from './types';

export const CURRENT_USER: User = {
  id: 'u-001',
  name: 'Alexandra Chen',
  role: Role.ADMINISTRATOR, // Change this to test RBAC
  avatar: 'https://picsum.photos/100/100'
};

export const MOCK_KPI: KPIMetric[] = [
  { label: 'Monthly Revenue', value: '$124,500', trend: 12.5, trendUp: true },
  { label: 'Active Job Cards', value: '42', trend: 5.2, trendUp: true },
  { label: 'Inventory Value', value: '$85,200', trend: 2.1, trendUp: false },
  { label: 'Avg Turnaround', value: '1.8 Days', trend: 0.5, trendUp: true },
];

export const MOCK_JOBS: JobOrder[] = [
  { id: 'JO-2024-001', customer: 'Acme Logistics', vehicle: 'Fleet Truck #44', description: 'Engine Overhaul', status: JobStatus.IN_PROGRESS, technicianId: 'tech-1', estimatedCost: 4500, dateCreated: '2024-05-10', progress: 65 },
  { id: 'JO-2024-002', customer: 'John Doe', vehicle: 'Mercedes S-Class', description: 'Brake System Service', status: JobStatus.PENDING, technicianId: 'tech-2', estimatedCost: 1200, dateCreated: '2024-05-11', progress: 0 },
  { id: 'JO-2024-003', customer: 'Luxury Rentals', vehicle: 'BMW X5', description: 'Regular Maintenance', status: JobStatus.COMPLETED, technicianId: 'tech-1', estimatedCost: 850, dateCreated: '2024-05-08', progress: 100 },
  { id: 'JO-2024-004', customer: 'City Transport', vehicle: 'Bus #102', description: 'Transmission Repair', status: JobStatus.QUALITY_CHECK, technicianId: 'tech-3', estimatedCost: 6200, dateCreated: '2024-05-09', progress: 90 },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'PART-001', name: 'Synthentic Oil 5W-40', sku: 'OIL-540-L', quantity: 450, minLevel: 100, price: 25, location: 'A-01-02', lastRestock: '2024-04-01' },
  { id: 'PART-002', name: 'Brake Pad Set (Ceramic)', sku: 'BRK-CER-01', quantity: 12, minLevel: 20, price: 150, location: 'B-04-12', lastRestock: '2024-03-15' },
  { id: 'PART-003', name: 'Oil Filter Type C', sku: 'FIL-OIL-C', quantity: 8, minLevel: 15, price: 18, location: 'A-02-05', lastRestock: '2024-02-20' },
  { id: 'PART-004', name: 'Spark Plug Platinum', sku: 'SPK-PLT-04', quantity: 200, minLevel: 50, price: 12, location: 'C-01-01', lastRestock: '2024-05-01' },
];

export const MOCK_PO: PurchaseOrder[] = [
  { id: 'PO-9001', vendor: 'Global Auto Parts', amount: 5400, status: 'Approved', date: '2024-05-10', items: ['Oil Filter', 'Brake Pads'] },
  { id: 'PO-9002', vendor: 'TechSupplies Inc', amount: 12000, status: 'Pending Approval', date: '2024-05-12', items: ['Diagnostic Tool v5'] },
];

export const MOCK_LOGS: AuditLog[] = [
  { id: 'LOG-001', action: 'Stock Adjustment', user: 'Inventory Clerk', timestamp: '10:42 AM', details: 'Manual deduction of 5 units (PART-002)', severity: 'medium' },
  { id: 'LOG-002', action: 'Job Status Update', user: 'Technician', timestamp: '09:15 AM', details: 'JO-2024-001 moved to In Progress', severity: 'low' },
  { id: 'LOG-003', action: 'Login Attempt', user: 'Unknown', timestamp: '03:00 AM', details: 'Failed login attempt from unknown IP', severity: 'high' },
];
