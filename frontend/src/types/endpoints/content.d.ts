// CurrentWeek
export interface GetAllContentConfig {
  success: boolean;
  data: ContentItem[];
}

export interface ContentItem {
  contentId: string
  contentGroup: string | null
  description: string
  valueType: string
  controlType: string
  meta?: Array<{ options: Array<{ label: string; value: string }> }> | null
  translate: ContentTranslate[]
  order: number
  isPublic: boolean
}

export interface ContentTranslate {
  lang: string
  value: string
  image: string
}

export interface UpdateContentResponse {
  success: boolean;
  data: ContentItem;
}