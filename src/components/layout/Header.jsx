import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, Flame, Trophy, LogOut, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-110">
            <Code2 className="h-6 w-6" />
          </div>
          <span className="text-xl font-extrabold text-foreground">
            Tech<span className="text-primary">Lingo</span>
          </span>
        </Link>

        {/* Navigation */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/learn" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-semibold"
            >
              <BookOpen className="h-4 w-4" />
              Learn
            </Link>
            <Link 
              to="/play" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-semibold"
            >
              <Trophy className="h-4 w-4" />
              Play
            </Link>
            <Link 
              to="/progress" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-semibold"
            >
              <User className="h-4 w-4" />
              Progress
            </Link>
          </nav>
        )}

        {/* User Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              {/* Stats */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="xp-badge">
                  <Trophy className="h-4 w-4" />
                  <span>{user.total_xp} XP</span>
                </div>
                <div className="streak-badge">
                  <Flame className="h-4 w-4" />
                  <span>{user.current_streak}</span>
                </div>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <span className="hidden md:block text-sm font-semibold text-muted-foreground">
                  {user.username}
                </span>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="default">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
