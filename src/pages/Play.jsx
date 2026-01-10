import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  RotateCcw, 
  Home, 
  Trophy, 
  Zap,
  Lightbulb,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import ProgressBar from '@/components/game/ProgressBar';
import OptionButton from '@/components/game/OptionButton';
import CodeBlock from '@/components/game/CodeBlock';
import XPDisplay from '@/components/game/XPDisplay';
import { useAuth } from '@/context/AuthContext';
import { mockTerms, generateGameQuestion } from '@/data/mockTerms';
import { toast } from 'sonner';

const QUESTIONS_PER_GAME = 5;
const XP_CORRECT = 10;
const XP_BONUS_STREAK = 5;

const Play = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Score tracking
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const currentQuestion = questions[currentIndex];

  const startGame = useCallback(() => {
    // Shuffle and pick random terms
    const shuffledTerms = [...mockTerms].sort(() => Math.random() - 0.5);
    const selectedTerms = shuffledTerms.slice(0, QUESTIONS_PER_GAME);
    
    const gameQuestions = selectedTerms.map(term => 
      generateGameQuestion(term, mockTerms)
    );

    setQuestions(gameQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
    setScore(0);
    setStreak(0);
    setTotalXP(0);
    setGameComplete(false);
    setGameStarted(true);
  }, []);

  const handleSelectAnswer = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    setShowResult(true);

    if (isCorrect) {
      const newStreak = streak + 1;
      const xpEarned = XP_CORRECT + (newStreak > 1 ? XP_BONUS_STREAK : 0);
      
      setScore(prev => prev + 1);
      setStreak(newStreak);
      setTotalXP(prev => prev + xpEarned);
      toast.success(`Correct! +${xpEarned} XP`);
    } else {
      setStreak(0);
      toast.error('Incorrect! The answer was: ' + currentQuestion.correct_answer);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      // Game complete
      setGameComplete(true);
      if (user) {
        updateUser({
          ...user,
          total_xp: user.total_xp + totalXP,
          current_streak: Math.max(user.current_streak, streak),
        });
      }
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    }
  };

  // Start screen
  if (!gameStarted) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex p-6 rounded-3xl bg-primary/10 mb-6">
              <Trophy className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold text-foreground mb-4">
              Guess the Term
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Read the definition, code example, or real-world usage and guess the correct tech term!
            </p>

            <div className="game-card mb-8">
              <h3 className="font-bold text-foreground mb-4">How it works:</h3>
              <ul className="text-left text-muted-foreground space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">1</span>
                  <span>You'll see a definition or code example</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">2</span>
                  <span>Choose the correct term from 4 options</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">3</span>
                  <span>Earn XP for correct answers, bonus XP for streaks!</span>
                </li>
              </ul>
            </div>

            <Button variant="game" size="xl" onClick={startGame}>
              Start Game <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Game complete screen
  if (gameComplete) {
    const accuracy = Math.round((score / questions.length) * 100);

    return (
      <Layout>
        <div className="container py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className={`inline-flex p-6 rounded-3xl mb-6 ${accuracy >= 80 ? 'bg-correct/10' : accuracy >= 50 ? 'bg-xp/10' : 'bg-incorrect/10'}`}>
              {accuracy >= 80 ? (
                <Trophy className="h-16 w-16 text-correct" />
              ) : accuracy >= 50 ? (
                <Zap className="h-16 w-16 text-xp" />
              ) : (
                <RotateCcw className="h-16 w-16 text-incorrect" />
              )}
            </div>
            
            <h1 className="text-4xl font-extrabold text-foreground mb-2">
              {accuracy >= 80 ? 'Amazing!' : accuracy >= 50 ? 'Good Job!' : 'Keep Learning!'}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              You completed the quiz!
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="game-card">
                <p className="text-3xl font-extrabold text-foreground">{score}/{questions.length}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="game-card">
                <p className="text-3xl font-extrabold text-primary">{accuracy}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
              <div className="game-card">
                <p className="text-3xl font-extrabold text-xp">{totalXP}</p>
                <p className="text-sm text-muted-foreground">XP Earned</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="game" size="lg" onClick={startGame}>
                <RotateCcw className="h-5 w-5" />
                Play Again
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/')}>
                <Home className="h-5 w-5" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Game in progress
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress & Stats */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="xp-badge">
                  <Trophy className="h-4 w-4" />
                  {totalXP} XP
                </div>
                {streak > 1 && (
                  <div className="streak-badge animate-bounce-subtle">
                    🔥 {streak} streak!
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-muted-foreground">
                {score}/{currentIndex + (showResult ? 1 : 0)} correct
              </span>
            </div>
            <ProgressBar current={currentIndex + 1} total={questions.length} />
          </div>

          {/* Question Card */}
          {currentQuestion && (
            <div className="game-card mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-muted-foreground">
                  What term matches this description?
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  disabled={showResult}
                >
                  <Lightbulb className="h-4 w-4" />
                  Hint
                </Button>
              </div>

              {/* Definition */}
              <p className="text-lg font-semibold text-foreground mb-6 leading-relaxed">
                "{currentQuestion.definition}"
              </p>

              {/* Code Example (if available) */}
              {currentQuestion.code_example && (
                <div className="mb-6">
                  <CodeBlock code={currentQuestion.code_example} />
                </div>
              )}

              {/* Hint */}
              {showHint && !showResult && (
                <div className="mb-6 p-4 bg-xp/10 rounded-xl border border-xp/30 animate-in slide-in-from-top-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>💡 Hint:</strong> {currentQuestion.real_world_example.slice(0, 100)}...
                  </p>
                </div>
              )}

              {/* Result Feedback */}
              {showResult && (
                <div className={`mb-6 p-4 rounded-xl border animate-in slide-in-from-top-2 ${
                  selectedAnswer === currentQuestion.correct_answer 
                    ? 'bg-correct/10 border-correct/30' 
                    : 'bg-incorrect/10 border-incorrect/30'
                }`}>
                  <div className="flex items-start gap-3">
                    {selectedAnswer === currentQuestion.correct_answer ? (
                      <CheckCircle2 className="h-5 w-5 text-correct flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-incorrect flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold text-foreground mb-1">
                        {selectedAnswer === currentQuestion.correct_answer 
                          ? 'Correct!' 
                          : `Incorrect. The answer is "${currentQuestion.correct_answer}"`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentQuestion.real_world_example}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <OptionButton
                    key={option}
                    option={option}
                    index={index}
                    selected={selectedAnswer === option}
                    showResult={showResult}
                    isCorrect={selectedAnswer === currentQuestion.correct_answer}
                    isCorrectAnswer={option === currentQuestion.correct_answer}
                    onClick={() => handleSelectAnswer(option)}
                    disabled={showResult}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center">
            {!showResult ? (
              <Button
                variant="game"
                size="lg"
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="min-w-[200px]"
              >
                Check Answer
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                {selectedAnswer === currentQuestion?.correct_answer && (
                  <XPDisplay xp={XP_CORRECT + (streak > 1 ? XP_BONUS_STREAK : 0)} animate size="lg" />
                )}
                <Button
                  variant="game"
                  size="lg"
                  onClick={handleNextQuestion}
                  className="min-w-[200px]"
                >
                  {currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question'}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Play;
