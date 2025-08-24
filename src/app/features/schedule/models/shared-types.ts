// Shared types for Gantt components
export interface Employee {
  id: string;
  name: string;
  avatar: string;
  shifts: { [key: string]: Shift[] };
}

export interface Shift {
  id: string;
  type: 'morning' | 'afternoon' | 'night';
  startTime: string;
  endTime: string;
  code: string;
  location?: string;
}

export type ViewMode = 'month' | 'week' | 'day';