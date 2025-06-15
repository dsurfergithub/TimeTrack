
import React, { useState, useEffect, useCallback } from 'react';
import { Task } from './types';
import { APP_NAME, DEFAULT_ICON, STORAGE_KEY_TASKS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import Modal from './components/Modal';
import { exportTasksToCSV } from './utils/export';
import { formatTime, parseTimeToSeconds } from './utils/time';

// SVG Icons
const PlusIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`}>
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);


const App: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY_TASKS, []);
  const [isTaskFormModalOpen, setIsTaskFormModalOpen] = useState(false);
  const [isEditTimeModalOpen, setIsEditTimeModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [manualTimeString, setManualTimeString] = useState("00:00:00");
  const [manualTimeError, setManualTimeError] = useState('');

  const sortedTasks = [...tasks].sort((a, b) => b.createdAt - a.createdAt);

  const handleAddTask = (name: string, icon: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      name,
      icon,
      totalSeconds: 0,
      isRunning: false,
      currentSessionStartTime: null,
      createdAt: Date.now(),
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const handleEditTask = (name: string, icon: string) => {
    if (!editingTask) return;
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === editingTask.id ? { ...task, name, icon } : task
      )
    );
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    }
  };

  const handleToggleTimer = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          if (task.isRunning) { // Pausing
            const elapsed = task.currentSessionStartTime ? Math.floor((Date.now() - task.currentSessionStartTime) / 1000) : 0;
            return {
              ...task,
              isRunning: false,
              totalSeconds: task.totalSeconds + elapsed,
              currentSessionStartTime: null,
            };
          } else { // Starting or Resuming
            return {
              ...task,
              isRunning: true,
              currentSessionStartTime: Date.now(),
            };
          }
        }
        return task;
      })
    );
  };
  
  const openTaskFormForEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormModalOpen(true);
  };

  const openEditTimeModal = (task: Task) => {
    setEditingTask(task);
    setManualTimeString(formatTime(task.totalSeconds));
    setManualTimeError('');
    setIsEditTimeModalOpen(true);
  };

  const handleManualTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    if (!/^\d{2}:\d{2}:\d{2}$/.test(manualTimeString)) {
        setManualTimeError('Invalid time format. Use HH:MM:SS.');
        return;
    }
    const newTotalSeconds = parseTimeToSeconds(manualTimeString);
     if (newTotalSeconds < 0) { // parseTimeToSeconds could return 0 for invalid, but let's be explicit
        setManualTimeError('Time cannot be negative.');
        return;
    }
    setManualTimeError('');

    setTasks(prevTasks => 
        prevTasks.map(t => 
            t.id === editingTask.id ? {...t, totalSeconds: newTotalSeconds, isRunning: false, currentSessionStartTime: null } : t
        )
    );
    setIsEditTimeModalOpen(false);
    setEditingTask(null);
  };


  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col items-center">
      <header className="w-full bg-red-600 text-white shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight">{APP_NAME}</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportTasksToCSV(tasks)}
              className="p-2 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 transition-colors"
              title="Export Data (CSV)"
              aria-label="Export tasks to CSV"
            >
              <DownloadIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                setEditingTask(null); // Ensure it's a new task
                setIsTaskFormModalOpen(true);
              }}
              className="flex items-center bg-white text-red-600 px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-75 transition-all duration-150 transform hover:scale-105"
              aria-label="Add new task"
            >
              <PlusIcon className="w-5 h-5 mr-1 sm:mr-2" />
              <span className="text-sm font-semibold">Add Task</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 w-full max-w-3xl flex-grow">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <img src="https://picsum.photos/seed/timetrackerempty/300/200" alt="Empty state illustration" className="mx-auto mb-6 rounded-lg shadow-md" />
            <p className="text-xl text-slate-600">No tasks yet!</p>
            <p className="text-slate-500">Click "Add Task" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleTimer={handleToggleTimer}
                onEditTaskRequest={openTaskFormForEdit}
                onDeleteTask={handleDeleteTask}
                onManualTimeEditRequest={openEditTimeModal}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="w-full text-center py-4 text-xs text-slate-500">
        <p>&copy; 2025 Dsurfer unlmtd. Crafted with ❤️.</p>
      </footer>
      
      <Modal
        isOpen={isTaskFormModalOpen}
        onClose={() => {
          setIsTaskFormModalOpen(false);
          setEditingTask(null); // Clear editing task when closing
        }}
        title={editingTask ? "Edit Task" : "Add New Task"}
      >
        <TaskForm
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          onClose={() => {
            setIsTaskFormModalOpen(false);
            setEditingTask(null);
          }}
          initialName={editingTask ? editingTask.name : ''}
          initialIcon={editingTask ? editingTask.icon : DEFAULT_ICON}
          submitButtonText={editingTask ? "Save Changes" : "Add Task"}
        />
      </Modal>

      <Modal
        isOpen={isEditTimeModalOpen}
        onClose={() => setIsEditTimeModalOpen(false)}
        title={`Edit Time for "${editingTask?.name || 'Task'}"`}
      >
        <form onSubmit={handleManualTimeSubmit} className="space-y-4">
          <div>
            <label htmlFor="manualTime" className="block text-sm font-medium text-slate-700 mb-1">
              Time (HH:MM:SS)
            </label>
            <input
              type="text"
              id="manualTime"
              value={manualTimeString}
              onChange={(e) => {
                setManualTimeString(e.target.value);
                if (manualTimeError && /^\d{2}:\d{2}:\d{2}$/.test(e.target.value)) {
                    setManualTimeError('');
                }
              }}
              className={`w-full px-3 py-2 border ${manualTimeError ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 ${manualTimeError ? 'focus:ring-red-400' : 'focus:ring-red-500'} focus:border-transparent transition-colors font-mono`}
              placeholder="00:00:00"
              autoFocus
            />
            {manualTimeError && <p className="text-xs text-red-500 mt-1">{manualTimeError}</p>}
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditTimeModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-colors"
            >
              Save Time
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default App;