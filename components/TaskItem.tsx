
import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import TimerDisplay from './TimerDisplay';
import IconButton from './IconButton';
import { formatTime } from '../utils/time';

// SVG Icons (Heroicons)
const PlayIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
  </svg>
);

const PauseIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`}>
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
  </svg>
);

const PencilIcon: React.FC<{className?: string}> = ({className}) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
  </svg>
);

const TrashIcon: React.FC<{className?: string}> = ({className}) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.9h1.368c1.603 0 2.816 1.336 2.816 2.9Zm-1.457.227a.75.75 0 0 1-.75.75Horizontallya.75.75 0 0 1-1.5 0V4.478c0-.83.678-1.5 1.5-1.5h1.368c.822 0 1.5.67 1.5 1.5v.227H15.043Zm-3.75-1.5a.75.75 0 0 0-.75.75v.227h1.5v-.227a.75.75 0 0 0-.75-.75Z" clipRule="evenodd" />
  </svg>
);

const ClockIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
  </svg>
);


interface TaskItemProps {
  task: Task;
  onToggleTimer: (id: string) => void;
  onEditTaskRequest: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onManualTimeEditRequest: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggleTimer, 
  onEditTaskRequest, 
  onDeleteTask,
  onManualTimeEditRequest
}) => {
  const [displayedSeconds, setDisplayedSeconds] = useState(task.totalSeconds);

  const calculateCurrentTime = useCallback(() => {
    if (task.isRunning && task.currentSessionStartTime) {
      const elapsedSinceStart = Math.floor((Date.now() - task.currentSessionStartTime) / 1000);
      return task.totalSeconds + elapsedSinceStart;
    }
    return task.totalSeconds;
  }, [task.isRunning, task.currentSessionStartTime, task.totalSeconds]);

  useEffect(() => {
    setDisplayedSeconds(calculateCurrentTime()); // Initial calculation

    if (task.isRunning) {
      const intervalId = setInterval(() => {
        setDisplayedSeconds(calculateCurrentTime());
      }, 1000);
      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.isRunning, task.currentSessionStartTime, task.totalSeconds, calculateCurrentTime]);


  const taskStateColor = task.isRunning ? 'border-green-500 bg-green-50' : (task.totalSeconds > 0 ? 'border-slate-400 bg-slate-50' : 'border-slate-300 bg-white');

  return (
    <div className={`p-4 rounded-lg shadow-md transition-all duration-300 border-l-4 ${taskStateColor} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
      <div className="flex items-center gap-3 flex-grow">
        <span className="text-3xl">{task.icon}</span>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 break-all">{task.name}</h3>
          <TimerDisplay totalSeconds={displayedSeconds} />
        </div>
      </div>
      
      <div className="flex items-center justify-end sm:justify-start space-x-2 flex-shrink-0">
        <IconButton 
          onClick={() => onToggleTimer(task.id)}
          className={`
            ${task.isRunning ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'} 
            w-12 h-12 sm:w-10 sm:h-10
          `}
          ariaLabel={task.isRunning ? "Pause timer" : "Start timer"}
        >
          {task.isRunning ? <PauseIcon className="w-6 h-6 sm:w-5 sm:h-5" /> : <PlayIcon className="w-6 h-6 sm:w-5 sm:h-5" />}
        </IconButton>
        <IconButton onClick={() => onManualTimeEditRequest(task)} ariaLabel="Edit time" title="Edit Time" className="text-slate-600 hover:text-red-500">
          <ClockIcon />
        </IconButton>
        <IconButton onClick={() => onEditTaskRequest(task)} ariaLabel="Edit task" title="Edit Task" className="text-slate-600 hover:text-red-500">
          <PencilIcon />
        </IconButton>
        <IconButton onClick={() => onDeleteTask(task.id)} ariaLabel="Delete task" title="Delete Task" className="text-slate-600 hover:text-red-500">
          <TrashIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default TaskItem;
