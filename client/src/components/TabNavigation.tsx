import React from 'react';
import { useLocation, Link } from 'wouter';
import { Home, Zap, Trophy, TrendingUp, User, Calendar } from 'lucide-react';

const TabNavigation: React.FC = () => {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 w-full bg-background shadow-sm border-t border-border/50 z-10">
      <div className="flex justify-around items-center py-2">
        <Link href="/">
          <div className="py-4 px-3 flex items-center justify-center cursor-pointer transition-all duration-200">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              location === '/' 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground/60 hover:text-foreground hover:bg-muted/20'
            }`}>
              <Home className="w-5 h-5" />
            </div>
          </div>
        </Link>
        <Link href="/emergency">
          <div className="py-4 px-3 flex items-center justify-center cursor-pointer transition-all duration-200">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              location === '/emergency' 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground/60 hover:text-foreground hover:bg-muted/20'
            }`}>
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </Link>
        <Link href="/challenges">
          <div className="py-4 px-3 flex items-center justify-center cursor-pointer transition-all duration-200">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              location === '/challenges' 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground/60 hover:text-foreground hover:bg-muted/20'
            }`}>
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Link>
        <Link href="/achievements">
          <div className="py-4 px-3 flex items-center justify-center cursor-pointer transition-all duration-200">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              location === '/achievements' 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground/60 hover:text-foreground hover:bg-muted/20'
            }`}>
              <Trophy className="w-5 h-5" />
            </div>
          </div>
        </Link>
        <Link href="/progress">
          <div className="py-4 px-3 flex items-center justify-center cursor-pointer transition-all duration-200">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              location === '/progress' 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground/60 hover:text-foreground hover:bg-muted/20'
            }`}>
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Link>
        <Link href="/profile">
          <div className="py-4 px-3 flex items-center justify-center cursor-pointer transition-all duration-200">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              location === '/profile' 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground/60 hover:text-foreground hover:bg-muted/20'
            }`}>
              <User className="w-5 h-5" />
            </div>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default TabNavigation;
