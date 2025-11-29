// CurrentWeek
export interface GetAllContentConfig {
  success: boolean;
  data: ContentItem[];
}

export interface ContentItem {
  contentId: string
  description: string
  valueType: string
  translate: ContentTranslate[]
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

export interface UpdateCreatorResponse {
  success: boolean;
  data: any;
}