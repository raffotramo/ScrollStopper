import React from 'react';
import { ChevronRight, Lock } from 'lucide-react';
import { ChallengeDay } from '../types';
import { getActivityClaim } from '../lib/challenges';

interface DailyChallengeProps {
  challenge: ChallengeDay;
  status: 'today' | 'completed' | 'locked';
  onClick: () => void;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ challenge, status, onClick }) => {
  let borderClass = 'border-neutral-600';
  let statusLabel = '';
  let statusClass = '';
  let dayTextClass = 'text-neutral-400';
  let titleClass = 'text-neutral-400';
  
  if (status === 'today') {
    borderClass = 'border-secondary';
    statusLabel = 'Oggi';
    statusClass = 'bg-secondary bg-opacity-20 text-secondary';
    dayTextClass = 'text-secondary';
    titleClass = 'text-white';
  } else if (status === 'completed') {
    borderClass = 'border-secondary';
    statusLabel = 'Completato';
    statusClass = 'bg-secondary bg-opacity-10 text-secondary';
    dayTextClass = 'text-white';
    titleClass = 'text-white';
  } else if (status === 'locked') {
    statusLabel = status === 'locked' ? 'Bloccato' : 'Domani';
    statusClass = 'bg-neutral-700 text-neutral-300';
  }

  return (
    <div className={`bg-card rounded-2xl shadow-sm p-4 mb-3 border border-border ${
      status === 'today' ? 'border-l-4 border-l-primary' : 
      status === 'completed' ? 'border-l-4 border-l-primary' : ''
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <span className={`font-bold mr-2 ${
              status === 'today' ? 'text-primary' :
              status === 'completed' ? 'text-foreground' :
              'text-muted-foreground'
            }`}>Giorno {challenge.day}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              status === 'today' ? 'bg-primary/15 text-primary' :
              status === 'completed' ? 'bg-primary/10 text-primary' :
              'bg-background border border-border/50 text-muted-foreground/70'
            }`}>{statusLabel}</span>
          </div>
          <h3 className={`font-medium mt-1 ${
            status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
          }`}>{challenge.title}</h3>
          <p className={`text-sm mt-1 ${
            status === 'locked' ? 'text-muted-foreground/70' : 'text-muted-foreground'
          }`}>{getActivityClaim(challenge.day)}</p>
        </div>
        <button 
          className={`${
            status === 'locked' ? 'text-muted-foreground' : 'text-primary hover:text-primary/80'
          } transition-colors`}
          onClick={onClick}
          disabled={status === 'locked'}
        >
          {status === 'locked' ? (
            <Lock className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default DailyChallenge;
