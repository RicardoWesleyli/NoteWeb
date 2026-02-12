import React, { useMemo } from 'react';
import Layout from '../../components/Layout/Layout';
import NavigationCard from '../../components/NavigationCard/NavigationCard';
import { useData } from '../../contexts/DataProvider';
import { NavigationData } from '../../types/navigation';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import QuoteDisplay from '../../components/QuoteDisplay/QuoteDisplay';
import { useTranslation } from 'react-i18next';
import * as LucideIcons from 'lucide-react';

const Home: React.FC = () => {
  const { categories, links } = useData();
  const data: NavigationData = {
    categories,
    links
  };
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { t } = useTranslation();

  // Helper to get icon component dynamically
  const getIconComponent = (iconName: string) => {
    // @ts-ignore
    const Icon = LucideIcons[iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())] || LucideIcons.Globe;
    return Icon;
  };

  const groupedLinks = useMemo(() => {
    let links = data.links;

    // Filter by search query if exists
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      links = links.filter(link => {
        const nameMatch = link.name.toLowerCase().includes(lowerQuery);
        let descMatch = false;
        
        if (link.description) {
          if (typeof link.description === 'string') {
            descMatch = link.description.toLowerCase().includes(lowerQuery);
          } else {
            descMatch = link.description.zh.toLowerCase().includes(lowerQuery) || 
                       link.description.en.toLowerCase().includes(lowerQuery);
          }
        }
        
        return nameMatch || descMatch;
      });
    }

    // Group links by category
    const grouped = data.categories.reduce((acc, category) => {
      const categoryLinks = links.filter(link => link.category === category.id);
      if (categoryLinks.length > 0) {
        acc[category.id] = categoryLinks;
      }
      return acc;
    }, {} as Record<string, typeof links>);

    return grouped;
  }, [searchQuery, data.links, data.categories]);

  return (
    <Layout>
      <div className="space-y-12">
        {/* Main Title Section */}
        <section className="text-center space-y-2 pt-4">
          <QuoteDisplay />
        </section>
        
        {/* Links Sections */}
        <AnimatePresence mode="wait">
          {Object.keys(groupedLinks).length > 0 ? (
            <div className="space-y-12">
              {data.categories.map((category) => {
                const categoryLinks = groupedLinks[category.id];
                if (!categoryLinks) return null;

                const CategoryIcon = getIconComponent(category.icon);

                return (
                  <section 
                    key={category.id}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div 
                        className="p-1.5 rounded-lg"
                        style={{ backgroundColor: `${category.color}15` }}
                      >
                        <CategoryIcon 
                          size={18} 
                          style={{ color: category.color }} 
                        />
                      </div>
                      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {t(`categories.${category.id}`)}
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                      {categoryLinks.map((link) => (
                        <div key={link.id}>
                          <NavigationCard link={link} />
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-block p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-lg">没有找到相关导航链接</p>
              <button 
                onClick={() => window.history.back()}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
              >
                返回上一页
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Home;