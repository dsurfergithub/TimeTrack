
import React from 'react';
import { IconOption, Task } from '../types';
import { AVAILABLE_ICONS } from '../constants';

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelectIcon }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
      <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 p-2 bg-slate-50 rounded-md border border-slate-300 max-h-48 overflow-y-auto">
        {AVAILABLE_ICONS.map((iconOption) => (
          <button
            key={iconOption.emoji}
            type="button"
            onClick={() => onSelectIcon(iconOption.emoji)}
            className={`text-2xl p-2 rounded-md transition-all duration-150 ${
              selectedIcon === iconOption.emoji 
                ? 'bg-red-500 ring-2 ring-red-300 scale-110' 
                : 'bg-slate-200 hover:bg-red-200'
            }`}
            aria-label={`Select icon: ${iconOption.name}`}
          >
            {iconOption.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconPicker;
