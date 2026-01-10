import React from "react";
import { Link } from "react-router-dom";
import {
  Gamepad2,
  BookOpen,
  Trophy,
  Target,
  Flame,
  Zap,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { mockUserProgress, getCategories } from "@/data/mockTerms";
import CategoryCard from "@/components/cards/CategoryCard";

const Dashboard = () => {
  const { user } = useAuth();
  const categories = getCategories();

  const stats = [
    {
      label: "Total XP",
      value: user?.total_xp || 0,
      icon: Trophy,
      color: "bg-xp text-xp-foreground",
    },
    {
      label: "Current Streak",
      value: user?.current_streak || 0,
      icon: Flame,
      color: "bg-streak text-streak-foreground",
    },
    {
      label: "Terms Learned",
      value: mockUserProgress.terms_learned,
      icon: Target,
      color: "bg-correct text-correct-foreground",
    },
    {
      label: "Accuracy",
      value: `${mockUserProgress.accuracy_rate}%`,
      icon: TrendingUp,
      color: "bg-primary text-primary-foreground",
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold mb-2">
            Welcome back, <span className="text-primary">{user?.username}</span>{" "}
            👋
          </h1>
          <p className="text-muted-foreground">
            Ready to level up your tech vocabulary today?
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="game-card">
              <div className={`inline-flex p-3 rounded-xl ${stat.color} mb-3`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/play">
            <div className="game-card hover:border-primary">
              <div className="flex gap-4">
                <div className="p-4 rounded-xl bg-primary text-primary-foreground">
                  <Gamepad2 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    Play "Guess the Term"
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Test your knowledge with quizzes
                  </p>
                  <Button variant="game">
                    Start Playing <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/learn">
            <div className="game-card hover:border-primary">
              <div className="flex gap-4">
                <div className="p-4 rounded-xl bg-secondary text-secondary-foreground">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Browse Vocabulary</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Explore terms with examples
                  </p>
                  <Button variant="secondary">
                    Start Learning <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-xl font-bold mb-4">Explore Categories</h2>
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
