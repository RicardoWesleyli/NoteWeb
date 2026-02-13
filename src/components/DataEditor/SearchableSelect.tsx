import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SearchableSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  renderOption?: (option: Option) => React.ReactNode;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ 
  value, 
  options, 
  onChange, 
  placeholder = 'Select...',
  renderOption 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Update position when opening
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
      
      // Focus search input after animation
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
        setSearchQuery(''); // Reset search on close
    }
  }, [isOpen]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-2 py-1.5 bg-transparent border-b border-transparent hover:bg-slate-50 dark:hover:bg-white/5 rounded transition-colors group focus:outline-none"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
            {selectedOption?.icon}
            <span className={clsx("text-sm truncate", !selectedOption && "text-slate-400")}>
                {selectedOption ? selectedOption.label : placeholder}
            </span>
        </div>
        <ChevronDown size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.1 }}
              style={{ 
                  top: position.top - window.scrollY, // Fixed positioning needs relative to viewport
                  left: position.left - window.scrollX,
                  width: Math.max(position.width, 200) // Min width 200px
              }}
              className="fixed z-[100] bg-white dark:bg-[#252525] rounded-xl shadow-xl border border-slate-200 dark:border-white/10 flex flex-col max-h-[300px]"
            >
              {/* Search Header */}
              <div className="p-2 border-b border-slate-100 dark:border-white/5 flex-none">
                <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    />
                </div>
              </div>

              {/* Options List */}
              <div className="flex-1 overflow-y-auto p-1 custom-scrollbar">
                {filteredOptions.length > 0 ? (
                    filteredOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={clsx(
                                "w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors",
                                option.value === value 
                                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                {option.icon}
                                <span className="truncate">{option.label}</span>
                            </div>
                            {option.value === value && <Check size={14} />}
                        </button>
                    ))
                ) : (
                    <div className="px-3 py-4 text-center text-xs text-slate-400">
                        No results found
                    </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default SearchableSelect;
