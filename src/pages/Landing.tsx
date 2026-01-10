import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Gamepad2, 
  BookOpen, 
  Trophy, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Gamepad2,
      title: 'Interactive Games',
      description: 'Learn by playing "Guess the Term" - read definitions and pick the right answer.',
    },
    {
      icon: BookOpen,
      title: 'Real Examples',
      description: 'Every term comes with code snippets and real-world usage examples.',
    },
    {
      icon: Trophy,
      title: 'Track Progress',
      description: 'Earn XP, maintain streaks, and unlock achievements as you learn.',
    },
    {
      icon: Users,
      title: 'Peer Learning',
      description: 'Compare scores on the leaderboard and learn together with colleagues.',
    },
  ];

  const terms = ['API', 'JWT', 'Docker', 'REST', 'GraphQL', 'CI/CD', 'Microservices', 'ORM'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Code2 className="h-6 w-6" />
            </div>
            <span className="text-xl font-extrabold text-foreground">
              Tech<span className="text-primary">Lingo</span>
            </span>
          </div>
          <Link to="/auth">
            <Button variant="default">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
            <Zap className="h-4 w-4" />
            Learn Tech Vocabulary the Fun Way
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
            Master Tech Terms Like a{' '}
            <span className="text-primary">Pro Developer</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A Duolingo-style platform that helps freshers learn technical vocabulary through 
            interactive games, real code examples, and progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button variant="game" size="xl">
                Start Learning Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Floating Terms */}
          <div className="flex flex-wrap justify-center gap-2 mt-12">
            {terms.map((term, i) => (
              <span 
                key={term}
                className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-semibold animate-bounce-subtle"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Why TechLingo?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for developers by developers. Learn essential tech vocabulary 
            in a way that actually sticks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="game-card text-center">
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-16 md:py-24 bg-muted rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            How It Works
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Pick a Topic', description: 'Choose from categories like Web Dev, DevOps, Security, and more.' },
              { step: 2, title: 'Play the Game', description: 'Read definitions, code examples, and guess the correct tech term.' },
              { step: 3, title: 'Track & Grow', description: 'Earn XP, maintain streaks, and watch your knowledge expand.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 md:py-24">
        <div className="game-card max-w-3xl mx-auto text-center bg-primary/5">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4">
            Ready to Level Up Your Tech Vocabulary?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of developers who are learning tech terms the fun way.
          </p>
          <ul className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
            {['100% Free', 'No Credit Card', 'Start in 30 Seconds'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-correct" />
                {item}
              </li>
            ))}
          </ul>
          <Link to="/auth">
            <Button variant="game" size="xl">
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 TechLingo - Code Vocabulary Builder</p>
          <p className="mt-1">Built with ❤️ for developers who want to learn</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
