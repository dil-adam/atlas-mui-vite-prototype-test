export type AuditStatus = 'scheduled' | 'in-progress' | 'completed' | 'overdue' | 'cancelled';

export interface Audit {
  id: string;
  name: string;
  description: string;
  status: AuditStatus;
  assigneeId: string | null;
  scheduledDate: string;
  completedDate?: string;
  groupId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  groupIds: string[];
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  type: 'department' | 'team' | 'project';
  memberIds: string[];
  createdAt: string;
}
