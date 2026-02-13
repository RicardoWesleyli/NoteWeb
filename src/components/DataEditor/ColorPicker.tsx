import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#84CC16', // Lime
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#D946EF', // Fuchsia
  '#F43F5E', // Rose
  '#64748B', // Slate
];

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Calculate position to keep it on screen, defaulting to bottom-left aligned
      // We'll use fixed positioning since we are portaling to body
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
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

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Basic validation or just allow typing and rely on effect?
    // Let's just pass it up, but maybe throttle or validate?
    // For now, raw update.
    onChange(val);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className="w-6 h-6 rounded-full border border-slate-200 dark:border-white/10 shadow-sm transition-transform active:scale-95"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs text-slate-400 font-mono uppercase">{color}</span>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              style={{ top: position.top, left: position.left }}
              className="fixed z-[100] p-3 bg-white dark:bg-[#252525] rounded-xl shadow-xl border border-slate-200 dark:border-white/10 w-48"
            >
              <div className="space-y-3">
                {/* Presets Grid */}
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">预设颜色</div>
                  <div className="grid grid-cols-6 gap-2">
                    {PRESET_COLORS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => {
                          onChange(preset);
                          setIsOpen(false);
                        }}
                        className={clsx(
                          "w-5 h-5 rounded-full border border-black/5 dark:border-white/10 transition-transform hover:scale-110",
                          color.toLowerCase() === preset.toLowerCase() && "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-[#252525]"
                        )}
                        style={{ backgroundColor: preset }}
                      />
                    ))}
                  </div>
                </div>

                {/* Hex Input */}
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">自定义 (Hex)</div>
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 rounded-lg px-2 py-1.5 border border-slate-200 dark:border-white/5 focus-within:border-blue-500 transition-colors">
                    <div 
                      className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={handleHexChange}
                      className="w-full bg-transparent border-none p-0 text-xs font-mono text-slate-700 dark:text-slate-200 focus:ring-0 uppercase"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default ColorPicker;
