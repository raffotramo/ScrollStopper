import React from 'react';
import { useLocation, Link } from 'wouter';
import { Home, Calendar, BookOpen, User } from 'lucide-react';

const TabNavigation: React.FC = () => {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 w-full bg-white shadow-lg border-t border-neutral-200 z-10">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`py-3 px-6 flex flex-col items-center ${location === '/' ? 'text-primary' : 'text-neutral-400'}`}>
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/calendar">
          <a className={`py-3 px-6 flex flex-col items-center ${location === '/calendar' ? 'text-primary' : 'text-neutral-400'}`}>
            <Calendar className="w-5 h-5" />
            <span className="text-xs mt-1">Calendario</span>
          </a>
        </Link>
        <Link href="/journal">
          <a className={`py-3 px-6 flex flex-col items-center ${location === '/journal' ? 'text-primary' : 'text-neutral-400'}`}>
            <BookOpen className="w-5 h-5" />
            <span className="text-xs mt-1">Diario</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`py-3 px-6 flex flex-col items-center ${location === '/profile' ? 'text-primary' : 'text-neutral-400'}`}>
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profilo</span>
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default TabNavigation;
