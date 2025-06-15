
export interface Task {
  id: string;
  name: string;
  icon: string; // Emoji character
  totalSeconds: number;
  isRunning: boolean;
  currentSessionStartTime: number | null;
  createdAt: number; // Timestamp for sorting
}

export interface IconOption {
  name: string;
  emoji: string;
}
