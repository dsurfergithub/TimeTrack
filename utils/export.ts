
import { Task } from '../types';
import { formatTime } from './time';

export const exportTasksToCSV = (tasks: Task[]): void => {
  if (tasks.length === 0) {
    alert("No tasks to export.");
    return;
  }

  const headers = "Date,Task Name,Icon,Time Spent (HH:MM:SS)";
  const today = new Date().toISOString().split('T')[0];

  const rows = tasks.map(task => 
    [
      today,
      `"${task.name.replace(/"/g, '""')}"`, // Escape double quotes in task name
      task.icon,
      formatTime(task.totalSeconds)
    ].join(',')
  );

  const csvContent = `${headers}\n${rows.join('\n')}`;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) { // feature detection
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `time_tracker_export_${today}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    alert("CSV export is not supported in your browser.");
  }
};
