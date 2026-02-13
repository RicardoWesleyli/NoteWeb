import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Download, RefreshCw, Plus, Trash2, AlertTriangle, Save, X, GripVertical, FileCode, Table as TableIcon, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useData } from '../../contexts/DataProvider';
import Tooltip from '../Tooltip/Tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Category, NavigationLink } from '../../types/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '../Toast/ToastContext';
import { useTranslation } from 'react-i18next';
import ColorPicker from './ColorPicker';
import SearchableSelect from './SearchableSelect';

interface DataEditorProps {
  viewMode?: 'categories' | 'links';
}

const AVAILABLE_ICONS = [
  'Globe', 'Search', 'Home', 'Star', 'Heart', 'Bookmark', 'Link', 'Cloud', 'Sun', 'Moon',
  'Code', 'Terminal', 'Database', 'Layout', 'Settings', 'User', 'Users', 'Mail', 'MessageSquare',
  'Music', 'Video', 'Image', 'Camera', 'Mic', 'Headphones', 'Book', 'BookOpen', 'FileText',
  'Folder', 'FolderOpen', 'Archive', 'Box', 'Package', 'ShoppingCart', 'CreditCard', 'DollarSign',
  'Map', 'MapPin', 'Navigation', 'Compass', 'Flag', 'Calendar', 'Clock', 'Watch', 'Timer',
  'Cpu', 'Monitor', 'Smartphone', 'Tablet', 'Wifi', 'Bluetooth', 'Server', 'HardDrive',
  'Activity', 'BarChart', 'PieChart', 'TrendingUp', 'Zap', 'Award', 'Gift', 'ThumbsUp',
  'Smile', 'Coffee', 'Utensils', 'Briefcase', 'Tool', 'Pen', 'Edit', 'Trash', 'Check', 'X',
  'Info', 'HelpCircle', 'AlertCircle', 'AlertTriangle', 'Shield', 'Lock', 'Unlock', 'Key',
  'Bot', 'Newspaper', 'Palette', 'Wrench'
];

// Helper to normalize icon name (kebab-case to PascalCase)
const normalizeIconName = (name: string) => {
  if (!name) return 'Globe';
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

const DataEditor: React.FC<DataEditorProps> = ({ viewMode }) => {
  const { categories, links, updateCategories, updateLinks, resetData } = useData();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'categories' | 'links'>(viewMode || 'links');
  const [isJsonMode, setIsJsonMode] = useState(false);
  
  // Local state for editing (draft)
  const [draftCategories, setDraftCategories] = useState<Category[]>([]);
  const [draftLinks, setDraftLinks] = useState<NavigationLink[]>([]);
  
  // JSON Editor State
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (viewMode) setActiveTab(viewMode);
  }, [viewMode]);

  // Initialize draft data from context
  useEffect(() => {
    setDraftCategories(categories);
    setDraftLinks(links);
    setHasChanges(false);
    
    // Init JSON text based on current active tab
    if (activeTab === 'categories') {
        setJsonText(JSON.stringify(categories, null, 2));
    } else {
        setJsonText(JSON.stringify(links, null, 2));
    }
  }, [categories, links]);
  
  // When switching tabs or modes, update JSON text or parse it back
  useEffect(() => {
      if (isJsonMode) {
          // Entering JSON mode: stringify current drafts
          if (activeTab === 'categories') {
              setJsonText(JSON.stringify(draftCategories, null, 2));
          } else {
              setJsonText(JSON.stringify(draftLinks, null, 2));
          }
          setJsonError(null);
      } else {
          // Exiting JSON mode (or switching tabs in Table mode): 
          // If we were in JSON mode and switched tab, we might lose unsaved JSON changes if we don't sync.
          // But simplest is: Table is source of truth when !isJsonMode.
          // When switching tabs in Table mode, just ensure drafts are ready (handled by initial effect? no, drafts persist)
      }
  }, [activeTab, isJsonMode]);

  // Check for changes (compare draft with source)
  useEffect(() => {
    const categoriesChanged = JSON.stringify(draftCategories) !== JSON.stringify(categories);
    const linksChanged = JSON.stringify(draftLinks) !== JSON.stringify(links);
    setHasChanges(categoriesChanged || linksChanged);
  }, [draftCategories, draftLinks, categories, links]);

  const handleSave = () => {
    if (isJsonMode && jsonError) return; // Don't save if JSON error
    
    // If in JSON mode, parse and update drafts first
    if (isJsonMode) {
        try {
            const parsed = JSON.parse(jsonText);
            if (activeTab === 'categories') {
                updateCategories(parsed);
                setDraftCategories(parsed);
            } else {
                updateLinks(parsed);
                setDraftLinks(parsed);
            }
        } catch (e) {
            setJsonError(t('editor.validation.invalidJson'));
            return;
        }
    } else {
        updateCategories(draftCategories);
        updateLinks(draftLinks);
    }
    setHasChanges(false);
    showToast(t('toast.settingsSaved'), 'success');
  };

  const handleReset = () => {
    setDraftCategories(categories);
    setDraftLinks(links);
    if (isJsonMode) {
        if (activeTab === 'categories') {
            setJsonText(JSON.stringify(categories, null, 2));
        } else {
            setJsonText(JSON.stringify(links, null, 2));
        }
        setJsonError(null);
    }
    setHasChanges(false);
  };

  const handleFactoryReset = () => {
    resetData();
    setIsResetConfirmOpen(false);
    showToast(t('toast.settingsReset'), 'success');
  };

  // Helper for generating options for SearchableSelect
  const getIconOptions = () => AVAILABLE_ICONS.map(iconName => ({
    value: iconName,
    label: iconName,
    icon: React.createElement((LucideIcons as any)[normalizeIconName(iconName)] || LucideIcons.HelpCircle, {
        size: 16,
        className: "text-slate-500 dark:text-slate-400"
    })
  }));

  // Helper for generating category options
  const getCategoryOptions = () => draftCategories.map(c => ({
    value: c.id,
    label: c.name,
    icon: React.createElement((LucideIcons as any)[normalizeIconName(c.icon)] || LucideIcons.HelpCircle, {
        size: 16,
        style: { color: c.color }
    })
  }));

  // Table Inline Editing Handlers
  const handleCategoryChange = (id: string, field: keyof Category, value: string) => {
    setDraftCategories(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleLinkChange = (id: string, field: keyof NavigationLink, value: string) => {
    setDraftLinks(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  // Filtered links based on search query
  const filteredLinks = useMemo(() => {
    if (!searchQuery) return draftLinks;
    const lowerQuery = searchQuery.toLowerCase();
    return draftLinks.filter(link => 
        link.name.toLowerCase().includes(lowerQuery) || 
        link.url.toLowerCase().includes(lowerQuery)
    );
  }, [draftLinks, searchQuery]);

  // Filtered categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return draftCategories;
    const lowerQuery = searchQuery.toLowerCase();
    return draftCategories.filter(category => 
        category.name.toLowerCase().includes(lowerQuery)
    );
  }, [draftCategories, searchQuery]);

  const handleAddRow = () => {
    if (activeTab === 'categories') {
        const newItem: Category = {
            id: uuidv4(),
            name: '新分类',
            icon: 'Globe',
            color: '#3B82F6'
        };
        setDraftCategories(prev => [...prev, newItem]);
    } else {
        const newItem: NavigationLink = {
            id: uuidv4(),
            name: '新链接',
            url: 'https://',
            category: draftCategories[0]?.id || '',
            description: ''
        };
        setDraftLinks(prev => [...prev, newItem]);
    }
  };

  const handleDeleteRow = (id: string) => {
    if (activeTab === 'categories') {
        if (window.confirm('删除分类也会删除该分类下的所有链接，确定吗？')) {
            setDraftCategories(prev => prev.filter(c => c.id !== id));
            // Also cleanup links
            setDraftLinks(prev => prev.filter(l => l.category !== id));
        }
    } else {
        setDraftLinks(prev => prev.filter(l => l.id !== id));
    }
  };

  // JSON Handlers
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setJsonText(val);
      try {
          const parsed = JSON.parse(val);
          if (!Array.isArray(parsed)) throw new Error('Root must be an array');
          setJsonError(null);
          
          // Sync to drafts immediately to trigger "Has Changes" state
          if (activeTab === 'categories') {
              setDraftCategories(parsed);
          } else {
              setDraftLinks(parsed);
          }
      } catch (err) {
          setJsonError((err as Error).message);
      }
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeTab === 'categories' ? draftCategories : draftLinks, null, 2));
    const fileName = activeTab === 'categories' ? "categories.json" : "links.json";
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Toolbar */}
      <div className="flex-none mb-4 flex items-center justify-between gap-4 bg-slate-50 dark:bg-white/5 p-2 rounded-xl border border-slate-200 dark:border-white/10">
        <div className="flex gap-2 flex-1">
          {!viewMode && (
            <div className="flex bg-slate-200 dark:bg-black/20 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('links')}
                className={clsx("px-3 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === 'links' ? "bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400")}
              >
                {t('editor.tabs.links')}
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={clsx("px-3 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === 'categories' ? "bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400")}
              >
                {t('editor.tabs.categories')}
              </button>
            </div>
          )}
          
          {/* Search Input */}
          {!isJsonMode && (
            <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={activeTab === 'categories' ? t('editor.placeholders.searchCategories') : t('editor.placeholders.searchLinks')}
                    className="pl-9 pr-3 py-1.5 text-sm bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors w-full"
                />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <div className="flex bg-slate-200 dark:bg-black/20 p-1 rounded-lg mr-2">
            <Tooltip content={t('editor.buttons.tableMode')} position="bottom">
                <button
                    onClick={() => setIsJsonMode(false)}
                    className={clsx("p-1.5 rounded-md transition-all", !isJsonMode ? "bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500")}
                >
                    <TableIcon size={16} />
                </button>
            </Tooltip>
            <Tooltip content={t('editor.buttons.jsonMode')} position="bottom">
                <button
                    onClick={() => setIsJsonMode(true)}
                    className={clsx("p-1.5 rounded-md transition-all", isJsonMode ? "bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500")}
                >
                    <FileCode size={16} />
                </button>
            </Tooltip>
          </div>

          {hasChanges && (
            <div className="flex gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
              <Tooltip content={t('editor.buttons.cancel')} position="bottom">
                <button 
                  onClick={handleReset}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </Tooltip>
              <Tooltip content={t('editor.buttons.save')} position="bottom">
                <button 
                  onClick={handleSave}
                  disabled={!!jsonError}
                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                </button>
              </Tooltip>
            </div>
          )}
          {!hasChanges && (
            <>
              <div className="w-px h-8 bg-slate-200 dark:bg-white/10 mx-1" />
              <Tooltip content={t('editor.buttons.export')} position="bottom">
                <button onClick={handleDownload} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                  <Download size={18} />
                </button>
              </Tooltip>
              <Tooltip content={t('editor.buttons.reset')} position="bottom">
                <button onClick={() => setIsResetConfirmOpen(true)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                  <RefreshCw size={18} />
                </button>
              </Tooltip>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-white/10 rounded-xl relative">
        {isJsonMode ? (
            // JSON Editor
            <div className="absolute inset-0 flex flex-col">
                <textarea
                    value={jsonText}
                    onChange={handleJsonChange}
                    className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none bg-transparent text-slate-800 dark:text-slate-200"
                    placeholder={t('editor.placeholders.enterJson')}
                    spellCheck={false}
                />
                {jsonError && (
                    <div className="absolute bottom-4 right-4 left-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        <X size={14} />
                        {jsonError}
                    </div>
                )}
            </div>
        ) : (
            // Table Editor
            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-white/5 sticky top-0 z-10">
                        <tr>
                            {activeTab === 'categories' ? (
                                <>
                                    <th className="p-3 text-xs font-medium text-slate-500 dark:text-slate-400 w-12">{t('editor.columns.index')}</th>
                                    <th className="p-3 text-xs font-medium text-slate-500 dark:text-slate-400 w-48">{t('editor.columns.name')}</th>
                                    <th className="p-3 text-xs font-medium text-slate-500 dark:text-slate-400 w-48">{t('editor.columns.icon')}</th>
                                    <th className="p-3 text-xs font-medium text-slate-500 dark:text-slate-400 w-32">{t('editor.columns.color')}</th>
                                    <th className="p-3 text-xs font-medium text-slate-500 dark:text-slate-400 w-20">{t('editor.columns.action')}</th>
                                </>
                            ) : (
                                <>
                                    <th className="p-3 text-xs font-medium text-slate-500 dark:text-slate-400 w-12">{t('editor.columns.index')}</th>
                                    <th className="p-3 text-xs font-medium text-slate-500 dark:text-slate-400 w-32">{t('editor.columns.name')}</th>
                                    <th className="p-3 text-xs font-medium text-slate-500 dark:text-slate-400">{t('editor.columns.url')}</th>
                                    <th className="p-3 text-xs font-medium text-slate-500 dark:text-slate-400 w-28">{t('editor.columns.category')}</th>
                                    <th className="p-3 text-xs font-medium text-slate-500 dark:text-slate-400 w-16">{t('editor.columns.action')}</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {activeTab === 'categories' ? (
                            filteredCategories.map((item, index) => (
                                <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-white/5">
                                    <td className="p-2 text-center text-slate-400 text-xs">{index + 1}</td>
                                    <td className="p-2">
                                        <input 
                                            value={item.name}
                                            onChange={(e) => handleCategoryChange(item.id, 'name', e.target.value)}
                                            className="w-full bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none px-1 py-0.5 text-sm text-slate-900 dark:text-slate-100"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <div className="relative group/icon">
                                            <SearchableSelect
                                                value={normalizeIconName(item.icon)}
                                                onChange={(value) => handleCategoryChange(item.id, 'icon', value)}
                                                options={getIconOptions()}
                                                placeholder={t('editor.placeholders.selectIcon')}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <div className="flex items-center gap-2">
                                            <ColorPicker
                                              color={item.color}
                                              onChange={(newColor) => handleCategoryChange(item.id, 'color', newColor)}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <button 
                                            onClick={() => handleDeleteRow(item.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            filteredLinks.map((item, index) => (
                                <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-white/5">
                                    <td className="p-2 text-center text-slate-400 text-xs">{index + 1}</td>
                                    <td className="p-2">
                                        <div className="flex items-center gap-2">
                                            <img 
                                                src={`https://www.google.com/s2/favicons?sz=64&domain_url=${item.url}`}
                                                className="w-4 h-4 rounded-sm"
                                                alt=""
                                                onError={(e) => (e.currentTarget.src = 'favicon.ico')}
                                            />
                                            <input 
                                                value={item.name}
                                                onChange={(e) => handleLinkChange(item.id, 'name', e.target.value)}
                                                className="w-full bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none px-1 py-0.5 text-sm text-slate-900 dark:text-slate-100"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <input 
                                            value={item.url}
                                            onChange={(e) => handleLinkChange(item.id, 'url', e.target.value)}
                                            className="w-full bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none px-1 py-0.5 text-sm text-slate-600 dark:text-slate-400"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <SearchableSelect
                                            value={item.category}
                                            onChange={(value) => handleLinkChange(item.id, 'category', value)}
                                            options={getCategoryOptions()}
                                            placeholder={t('editor.placeholders.selectCategory')}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <button 
                                            onClick={() => handleDeleteRow(item.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        <tr>
                            <td colSpan={5} className="p-2">
                                <button 
                                    onClick={handleAddRow}
                                    className="w-full py-2 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 rounded-lg transition-all"
                                >
                                    <Plus size={16} />
                                    {t('editor.buttons.add')}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )}
      </div>

      {/* Reset Confirmation */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResetConfirmOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#1E1E1E] rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-4"
            >
              <div className="flex items-center gap-3 text-red-500">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">确认重置?</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm">这将清除所有本地修改并恢复到出厂默认设置。此操作不可撤销。</p>
              <div className="flex gap-3">
                <button onClick={() => setIsResetConfirmOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition-colors">取消</button>
                <button onClick={handleFactoryReset} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">确认重置</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DataEditor;
