export interface StatCardLineItem {
  label: string;
  value: string;
}

export interface StatCardViewModel {
  id: string;
  title: string;
  primaryValue?: string;
  items?: StatCardLineItem[];
}
