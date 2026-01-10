// User types
export interface User {
  id: number;
  email: string;
  username: string;
  total_xp: number;
  current_streak: number;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
}

// Term types
export interface Term {
  id: number;
  name: string;
  definition: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  code_example?: string;
  real_world_example: string;
  created_at: string;
}

// Game types
export interface GameQuestion {
  id: number;
  term_id: number;
  definition: string;
  code_example?: string;
  real_world_example: string;
  options: string[];
  correct_answer: string;
  category: string;
  difficulty: string;
}

export interface GameSession {
  id: number;
  user_id: number;
  total_questions: number;
  correct_answers: number;
  xp_earned: number;
  completed: boolean;
  started_at: string;
  completed_at?: string;
}

export interface AnswerResult {
  correct: boolean;
  correct_answer: string;
  xp_earned: number;
  explanation: string;
}

// Progress types
export interface UserProgress {
  user_id: number;
  terms_learned: number;
  total_terms: number;
  accuracy_rate: number;
  categories_completed: string[];
  recent_terms: Term[];
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  total_xp: number;
  current_streak: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
