import React from 'react';
import { 
  Trophy, 
  Flame, 
  Target, 
  TrendingUp, 
  Award,
  Crown,
  Medal
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { mockUserProgress, mockLeaderboard, getCategories } from '@/data/mockTerms';
import { cn } from '@/lib/utils';

const Progress = () => {
  const { user } = useAuth();
  const categories = getCategories();

  const stats = [
    { 
      label: 'Total XP', 
      value: user?.total_xp || 0, 
      icon: Trophy, 
      color: 'bg-xp text-xp-foreground',
      description: 'Experience points earned'
    },
    { 
      label: 'Current Streak', 
      value: user?.current_streak || 0, 
      icon: Flame, 
      color: 'bg-streak text-streak-foreground',
      description: 'Consecutive correct answers'
    },
    { 
      label: 'Terms Learned', 
      value: mockUserProgress.terms_learned, 
      icon: Target, 
      color: 'bg-correct text-correct-foreground',
      description: 'Out of ' + mockUserProgress.total_terms + ' total'
    },
    { 
      label: 'Accuracy', 
      value: `${mockUserProgress.accuracy_rate}%`, 
      icon: TrendingUp, 
      color: 'bg-primary text-primary-foreground',
      description: 'Average quiz performance'
    },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-xp" />;
      case 2: return <Medal className="h-5 w-5 text-muted-foreground" />;
      case 3: return <Award className="h-5 w-5 text-streak" />;
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-2">
            Your Progress 📊
          </h1>
          <p className="text-muted-foreground">
            Track your learning journey and see how you rank
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="game-card">
              <div className={`inline-flex p-3 rounded-xl ${stat.color} mb-3`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-3xl font-extrabold text-foreground">{stat.value}</p>
              <p className="text-sm font-semibold text-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Category Progress */}
          <div className="game-card">
            <h2 className="text-xl font-bold text-foreground mb-6">Category Progress</h2>
            <div className="space-y-4">
              {categories.map((category) => {
                const learned = Math.floor(Math.random() * category.count);
                const percentage = Math.round((learned / category.count) * 100);
                const isCompleted = mockUserProgress.categories_completed.includes(category.name);
                
                return (
                  <div key={category.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{category.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {learned}/{category.count}
                        {isCompleted && <span className="ml-2">✅</span>}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isCompleted ? "bg-correct" : "progress-bar-fill"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="game-card">
            <h2 className="text-xl font-bold text-foreground mb-6">Leaderboard 🏆</h2>
            <div className="space-y-3">
              {mockLeaderboard.map((entry) => {
                const isCurrentUser = entry.username === user?.username;
                
                return (
                  <div 
                    key={entry.rank}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-xl transition-colors",
                      isCurrentUser ? "bg-primary/10 border border-primary/30" : "bg-muted"
                    )}
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(entry.rank) || (
                        <span className="text-lg font-bold text-muted-foreground">
                          {entry.rank}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "font-semibold",
                        isCurrentUser ? "text-primary" : "text-foreground"
                      )}>
                        {entry.username}
                        {isCurrentUser && <span className="ml-2 text-xs">(You)</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="xp-badge text-xs">
                        <Trophy className="h-3 w-3" />
                        {entry.total_xp}
                      </div>
                      <div className="streak-badge text-xs">
                        <Flame className="h-3 w-3" />
                        {entry.current_streak}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="game-card mt-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Achievements 🎖️</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'First Steps', description: 'Complete your first quiz', unlocked: true, icon: '🎯' },
              { name: 'Quick Learner', description: 'Learn 10 terms', unlocked: true, icon: '📚' },
              { name: 'Streak Master', description: 'Get 5 answers in a row', unlocked: false, icon: '🔥' },
              { name: 'Perfectionist', description: 'Score 100% on a quiz', unlocked: false, icon: '⭐' },
              { name: 'Category Expert', description: 'Complete all terms in a category', unlocked: false, icon: '🏆' },
              { name: 'XP Hunter', description: 'Earn 1000 XP', unlocked: false, icon: '💎' },
              { name: 'Daily Devotee', description: 'Learn for 7 days straight', unlocked: false, icon: '📆' },
              { name: 'Tech Guru', description: 'Learn all terms', unlocked: false, icon: '👑' },
            ].map((achievement) => (
              <div 
                key={achievement.name}
                className={cn(
                  "p-4 rounded-xl border-2 text-center transition-all",
                  achievement.unlocked 
                    ? "bg-xp/10 border-xp/30" 
                    : "bg-muted border-border opacity-60"
                )}
              >
                <span className="text-3xl block mb-2">{achievement.icon}</span>
                <p className="font-bold text-sm text-foreground">{achievement.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                {achievement.unlocked && (
                  <span className="text-xs text-correct font-semibold mt-2 block">✓ Unlocked</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Progress;
