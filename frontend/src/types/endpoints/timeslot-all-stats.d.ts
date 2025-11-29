export interface GetTimeSlotStat {
  success: boolean;
  data: TimeSlotStat;
  error?: string;
}

export interface TimeSlotStat {
  [timestamp: string]: number;
}
