import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category, NavigationLink } from '../types/navigation';
import categoriesData from '../data/categories.json';
import linksData from '../data/links.json';

interface DataContextType {
  categories: Category[];
  links: NavigationLink[];
  updateCategories: (newCategories: Category[]) => void;
  updateLinks: (newLinks: NavigationLink[]) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(categoriesData);
  const [links, setLinks] = useState<NavigationLink[]>(linksData);

  // Initialize from localStorage
  useEffect(() => {
    const storedCategories = localStorage.getItem('site_categories');
    const storedLinks = localStorage.getItem('site_links');

    if (storedCategories) {
      try {
        setCategories(JSON.parse(storedCategories));
      } catch (e) {
        console.error('Failed to parse categories from localStorage', e);
      }
    }

    if (storedLinks) {
      try {
        setLinks(JSON.parse(storedLinks));
      } catch (e) {
        console.error('Failed to parse links from localStorage', e);
      }
    }
  }, []);

  const updateCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem('site_categories', JSON.stringify(newCategories));
  };

  const updateLinks = (newLinks: NavigationLink[]) => {
    setLinks(newLinks);
    localStorage.setItem('site_links', JSON.stringify(newLinks));
  };

  const resetData = () => {
    setCategories(categoriesData);
    setLinks(linksData);
    localStorage.removeItem('site_categories');
    localStorage.removeItem('site_links');
  };

  return (
    <DataContext.Provider value={{ categories, links, updateCategories, updateLinks, resetData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
