import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Gamepad2, 
  BookOpen, 
  Trophy, 
  Target, 
  Flame, 
  Zap,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { mockUserProgress, getCategories } from '@/data/mockTerms';
import CategoryCard from '@/components/cards/CategoryCard';

const Dashboard = () => {
  const { user } = useAuth();
  const categories = getCategories();

  const stats = [
    { 
      label: 'Total XP', 
      value: user?.total_xp || 0, 
      icon: Trophy, 
      color: 'bg-xp text-xp-foreground' 
    },
    { 
      label: 'Current Streak', 
      value: user?.current_streak || 0, 
      icon: Flame, 
      color: 'bg-streak text-streak-foreground' 
    },
    { 
      label: 'Terms Learned', 
      value: mockUserProgress.terms_learned, 
      icon: Target, 
      color: 'bg-correct text-correct-foreground' 
    },
    { 
      label: 'Accuracy', 
      value: `${mockUserProgress.accuracy_rate}%`, 
      icon: TrendingUp, 
      color: 'bg-primary text-primary-foreground' 
    },
  ];

  return (
    <Layout>
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-2">
            Welcome back, <span className="text-primary">{user?.username}</span>! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to level up your tech vocabulary today?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="game-card">
              <div className={`inline-flex p-3 rounded-xl ${stat.color} mb-3`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/play" className="block">
            <div className="game-card group cursor-pointer hover:border-primary">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-xl bg-primary text-primary-foreground">
                  <Gamepad2 className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    Play "Guess the Term"
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Test your knowledge with our interactive quiz game
                  </p>
                  <Button variant="game" size="default" className="group-hover:scale-105 transition-transform">
                    Start Playing <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/learn" className="block">
            <div className="game-card group cursor-pointer hover:border-primary">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-xl bg-secondary text-secondary-foreground">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    Browse Vocabulary
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Explore tech terms with examples and code snippets
                  </p>
                  <Button variant="secondary" size="default" className="group-hover:scale-105 transition-transform">
                    Start Learning <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Progress Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Your Progress</h2>
            <Link to="/progress">
              <Button variant="ghost" size="sm">
                View Details <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="game-card">
            <div className="flex items-center gap-4 mb-4">
              <Zap className="h-6 w-6 text-xp" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-muted-foreground">
                  {mockUserProgress.terms_learned} of {mockUserProgress.total_terms} terms learned
                </p>
              </div>
              <span className="text-lg font-bold text-primary">
                {Math.round((mockUserProgress.terms_learned / mockUserProgress.total_terms) * 100)}%
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${(mockUserProgress.terms_learned / mockUserProgress.total_terms) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Explore Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                termCount={category.count}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
