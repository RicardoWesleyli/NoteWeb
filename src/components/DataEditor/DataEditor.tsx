import React, { useState, useEffect, useRef } from 'react';
import { Download, RefreshCw, X, Edit2, AlertTriangle } from 'lucide-react';
import { useData } from '../../contexts/DataProvider';
import Tooltip from '../Tooltip/Tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface DataEditorProps {
  viewMode?: 'categories' | 'links';
}

const DataEditor: React.FC<DataEditorProps> = ({ viewMode }) => {
  const { categories, links, updateCategories, updateLinks, resetData } = useData();
  const [activeTab, setActiveTab] = useState<'categories' | 'links'>(viewMode || 'links');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (viewMode) {
      setActiveTab(viewMode);
    }
  }, [viewMode]);

  // Update JSON text when data changes
  useEffect(() => {
    if (activeTab === 'categories') {
      setJsonText(JSON.stringify(categories, null, 2));
    } else {
      setJsonText(JSON.stringify(links, null, 2));
    }
    setJsonError(null);
  }, [categories, links, activeTab]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setJsonText(newText);
    
    try {
      const parsed = JSON.parse(newText);
      setJsonError(null);
      
      if (activeTab === 'categories') {
        if (Array.isArray(parsed)) {
          updateCategories(parsed);
        } else {
          setJsonError('数据必须是数组格式');
        }
      } else {
        if (Array.isArray(parsed)) {
          updateLinks(parsed);
        } else {
          setJsonError('数据必须是数组格式');
        }
      }
    } catch (err) {
      setJsonError((err as Error).message);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (err) {
      // Ignore format error if invalid JSON
    }
  };

  const handleDownload = () => {
    let dataStr = "";
    let fileName = "";

    if (activeTab === 'categories') {
      dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(categories, null, 2));
      fileName = "categories.json";
    } else {
      dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(links, null, 2));
      fileName = "links.json";
    }

    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  const handleResetClick = () => {
    setIsResetConfirmOpen(true);
  };

  const confirmReset = () => {
    resetData();
    setIsResetConfirmOpen(false);
  };

  // 渲染 JSON 编辑器
  return (
    <div className="space-y-4 relative h-full flex flex-col">
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResetConfirmOpen(false)}
              className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4"
            >
              <div className="flex items-center gap-3 text-amber-500 dark:text-amber-400">
                <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">确认重置数据？</h3>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                此操作将清除所有本地修改的数据，恢复到初始默认状态。此操作<span className="font-bold text-red-500">无法撤销</span>。
              </p>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmReset}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm shadow-red-500/20 transition-colors"
                >
                  确认重置
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <div className="flex-none space-y-3">
        <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-white/5 p-1.5 rounded-lg border border-slate-200 dark:border-white/10">
          {!viewMode && (
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('links')}
                className={clsx(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                  activeTab === 'links' 
                    ? "bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5"
                )}
              >
                链接 JSON
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={clsx(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                  activeTab === 'categories' 
                    ? "bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5"
                )}
              >
                分类 JSON
              </button>
            </div>
          )}
          {viewMode && (
            null
          )}
          <div className="flex gap-1 ml-auto">
            <Tooltip content="格式化 JSON" position="bottom">
              <button 
                onClick={handleFormat}
                className="p-2 rounded-md text-slate-500 hover:text-blue-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                aria-label="格式化 JSON"
              >
                <Edit2 size={18} />
              </button>
            </Tooltip>
            <Tooltip content="重置为默认" position="bottom">
              <button 
                onClick={handleResetClick}
                className="p-2 rounded-md text-slate-500 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                aria-label="重置为默认"
              >
                <RefreshCw size={18} />
              </button>
            </Tooltip>
            <Tooltip content="下载 JSON" position="bottom">
              <button 
                onClick={handleDownload}
                className="p-2 rounded-md text-slate-500 hover:text-blue-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                aria-label="下载 JSON"
              >
                <Download size={18} />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* JSON Editor Area */}
      <div className="flex-1 relative min-h-0 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden bg-white dark:bg-[#1E1E1E]">
        <textarea
          ref={textAreaRef}
          value={jsonText}
          onChange={handleJsonChange}
          className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-transparent text-slate-800 dark:text-slate-200"
          spellCheck={false}
        />
        {jsonError && (
          <div className="absolute bottom-4 right-4 left-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <X size={14} />
            {jsonError}
          </div>
        )}
      </div>
      
      <div className="flex-none text-xs text-slate-500 dark:text-slate-400 px-1">
        提示：直接修改 JSON 内容即可实时生效。请保持 JSON 格式正确。
      </div>
    </div>
  );
};

export default DataEditor;
