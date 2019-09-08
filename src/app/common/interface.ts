export interface Item {
  id: string;
  contentDetails: ContentDetails;
  snippet: Snippet;
}

export interface ContentDetails {
  duration: number | string;
}

export interface Snippet {
  title: string;
  thumbnails?: Thumbnails;
}

export interface List {
  list: Item[];
}

export interface VideoResponse {
  items: Item[];
}

export interface ToggleSuggestions {
  checked: boolean;
  disabled: boolean;
}

export interface Thumbnails {
  default: {
    url: string;
  };
}
