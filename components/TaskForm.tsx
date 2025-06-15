
import React, { useState, useEffect } from 'react';
import { DEFAULT_ICON } from '../constants';
import IconPicker from './IconPicker';

interface TaskFormProps {
  onSubmit: (name: string, icon: string) => void;
  onClose: () => void;
  initialName?: string;
  initialIcon?: string;
  submitButtonText?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  onSubmit, 
  onClose, 
  initialName = '', 
  initialIcon = DEFAULT_ICON,
  submitButtonText = "Save Task"
}) => {
  const [name, setName] = useState(initialName);
  const [icon, setIcon] = useState(initialIcon);
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    setName(initialName);
    setIcon(initialIcon);
    setNameError('');
  }, [initialName, initialIcon, onClose]); // Reset form when initial props change or form is re-opened

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') {
      setNameError('Task name cannot be empty.');
      return;
    }
    setNameError('');
    onSubmit(name.trim(), icon);
    onClose(); // Close modal after submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="taskName" className="block text-sm font-medium text-slate-700 mb-1">
          Task Name
        </label>
        <input
          type="text"
          id="taskName"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim() !== '') setNameError('');
          }}
          className={`w-full px-3 py-2 border ${nameError ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 ${nameError ? 'focus:ring-red-400' : 'focus:ring-red-500'} focus:border-transparent transition-colors`}
          placeholder="E.g., Design new logo"
          autoFocus
        />
        {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
      </div>
      
      <IconPicker selectedIcon={icon} onSelectIcon={setIcon} />

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-colors"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
