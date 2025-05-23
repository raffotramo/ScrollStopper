import React from 'react';
import { useLocation, Link } from 'wouter';
import { Home, Calendar, BookOpen, TrendingUp, User } from 'lucide-react';

const TabNavigation: React.FC = () => {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 w-full bg-card shadow-lg border-t border-border z-10">
      <div className="flex justify-around items-center py-2">
        <Link href="/">
          <div className={`py-2 px-4 flex flex-col items-center cursor-pointer transition-colors ${
            location === '/' 
              ? 'text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}>
            <div className={`p-2 rounded-full ${location === '/' ? 'bg-primary text-primary-foreground' : ''}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-xs mt-1">Home</span>
          </div>
        </Link>
        <Link href="/calendar">
          <div className={`py-2 px-4 flex flex-col items-center cursor-pointer transition-colors ${
            location === '/calendar' 
              ? 'text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}>
            <div className={`p-2 rounded-full ${location === '/calendar' ? 'bg-primary text-primary-foreground' : ''}`}>
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs mt-1">Calendario</span>
          </div>
        </Link>
        <Link href="/progress">
          <div className={`py-2 px-4 flex flex-col items-center cursor-pointer transition-colors ${
            location === '/progress' 
              ? 'text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}>
            <div className={`p-2 rounded-full ${location === '/progress' ? 'bg-primary text-primary-foreground' : ''}`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs mt-1">Progresso</span>
          </div>
        </Link>
        <Link href="/profile">
          <div className={`py-2 px-4 flex flex-col items-center cursor-pointer transition-colors ${
            location === '/profile' 
              ? 'text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}>
            <div className={`p-2 rounded-full ${location === '/profile' ? 'bg-primary text-primary-foreground' : ''}`}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs mt-1">Profilo</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default TabNavigation;
