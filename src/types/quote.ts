export interface Quote {
  id: number;
  en: string;
  zh: string;
}

export interface QuoteResponse {
  code: number;
  msg: string;
  data: Quote[];
}