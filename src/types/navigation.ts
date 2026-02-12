export interface NavigationLink {
  id: string;
  name: string;
  url: string;
  icon?: string;
  category: string;
  description?: string | { zh: string; en: string };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface NavigationData {
  categories: Category[];
  links: NavigationLink[];
}
