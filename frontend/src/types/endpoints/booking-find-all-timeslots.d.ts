export interface FindAllTimeslotsResponse {
  success: boolean;
  data: Data[];
}

export interface Data {
  id: number;
  createdAt: string;
  updatedAt: string;
  deleteAt: string | null;
  start: string;
  end: string;
}
