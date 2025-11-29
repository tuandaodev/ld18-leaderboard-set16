export interface CurrentWeekResponse {
  success: boolean;
  data: Data;
}

export interface Data {
  id: number;
  createdAt: string;
  updatedAt: string;
  deleteAt: string | null;
  startTime: string;
  isAllowedToBook: boolean;
  weekDayGameFormat: string;
  weekendGameFormat: string;
  userBookThreshold: number;
}
