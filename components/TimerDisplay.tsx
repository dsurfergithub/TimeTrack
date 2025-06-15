
import React from 'react';
import { formatTime } from '../utils/time';

interface TimerDisplayProps {
  totalSeconds: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ totalSeconds }) => {
  return (
    <span className="font-mono text-lg text-slate-700">
      {formatTime(totalSeconds)}
    </span>
  );
};

export default TimerDisplay;
