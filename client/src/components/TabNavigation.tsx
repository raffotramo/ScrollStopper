import React from 'react';
import { useLocation, Link } from 'wouter';
import { Home, Calendar, BookOpen, User } from 'lucide-react';

const TabNavigation: React.FC = () => {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 w-full bg-neutral-800 shadow-lg border-t border-neutral-700 z-10">
      <div className="flex justify-around">
        <Link href="/">
          <div className={`py-3 px-6 flex flex-col items-center cursor-pointer ${location === '/' ? 'text-secondary' : 'text-primary'}`}>
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </div>
        </Link>
        <Link href="/calendar">
          <div className={`py-3 px-6 flex flex-col items-center cursor-pointer ${location === '/calendar' ? 'text-secondary' : 'text-primary'}`}>
            <Calendar className="w-5 h-5" />
            <span className="text-xs mt-1">Calendario</span>
          </div>
        </Link>
        <Link href="/journal">
          <div className={`py-3 px-6 flex flex-col items-center cursor-pointer ${location === '/journal' ? 'text-secondary' : 'text-primary'}`}>
            <BookOpen className="w-5 h-5" />
            <span className="text-xs mt-1">Diario</span>
          </div>
        </Link>
        <Link href="/profile">
          <div className={`py-3 px-6 flex flex-col items-center cursor-pointer ${location === '/profile' ? 'text-secondary' : 'text-primary'}`}>
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profilo</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default TabNavigation;
