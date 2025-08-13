import {Shift} from "@features/shifts";

export interface DateSummary {
  date: string;
  total_shifts: number;
}

export interface ShiftHistoryResponse {
  success: boolean;
  data: {
    current_shift: Shift | null;
    shift_history: Shift[] | null;
    date_summary: DateSummary[] | null;
  };
}

export interface ShiftHistoryState {
  loading: boolean;
  selectedDate: string;
  currentShift: Shift | null;
  shiftHistory: Shift[] | null;
  dateSummary: DateSummary[] | null;
  error: string | null;
}
