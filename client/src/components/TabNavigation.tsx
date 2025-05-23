import React from 'react';
import { useLocation, Link } from 'wouter';
import { Home, Calendar, BookOpen, TrendingUp, User } from 'lucide-react';

const TabNavigation: React.FC = () => {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 w-full bg-background shadow-sm border-t border-border/50 z-10">
      <div className="flex justify-around items-center py-2">
        <Link href="/">
          <div className={`py-4 px-4 flex items-center justify-center cursor-pointer transition-all duration-200 ${
            location === '/' 
              ? 'text-primary' 
              : 'text-muted-foreground/60 hover:text-foreground'
          }`}>
            <Home className="w-6 h-6" />
          </div>
        </Link>
        <Link href="/calendar">
          <div className={`py-4 px-4 flex items-center justify-center cursor-pointer transition-all duration-200 ${
            location === '/calendar' 
              ? 'text-primary' 
              : 'text-muted-foreground/60 hover:text-foreground'
          }`}>
            <Calendar className="w-6 h-6" />
          </div>
        </Link>
        <Link href="/progress">
          <div className={`py-4 px-4 flex items-center justify-center cursor-pointer transition-all duration-200 ${
            location === '/progress' 
              ? 'text-primary' 
              : 'text-muted-foreground/60 hover:text-foreground'
          }`}>
            <TrendingUp className="w-6 h-6" />
          </div>
        </Link>
        <Link href="/profile">
          <div className={`py-4 px-4 flex items-center justify-center cursor-pointer transition-all duration-200 ${
            location === '/profile' 
              ? 'text-primary' 
              : 'text-muted-foreground/60 hover:text-foreground'
          }`}>
            <User className="w-6 h-6" />
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default TabNavigation;
