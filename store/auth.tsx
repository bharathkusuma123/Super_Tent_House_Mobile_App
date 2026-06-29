import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types';
import { mockApi } from '@/services/api';

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTH'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_AUTH':
      return { user: action.payload.user, token: action.payload.token, isLoading: false, isAuthenticated: true };
    case 'LOGOUT':
      return { user: null, token: null, isLoading: false, isAuthenticated: false };
    case 'UPDATE_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
    default:
      return state;
  }
}

type AuthContextType = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Lightweight storage abstraction using localStorage on web, in-memory fallback elsewhere
const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {}
    return null;
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {}
  },
  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const token = await storage.getItem('auth_token');
        const userStr = await storage.getItem('auth_user');
        if (token && userStr) {
          dispatch({ type: 'SET_AUTH', payload: { user: JSON.parse(userStr), token } });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await mockApi.login(email, password);
    await storage.setItem('auth_token', result.token);
    await storage.setItem('auth_user', JSON.stringify(result.user));
    dispatch({ type: 'SET_AUTH', payload: result });
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await mockApi.register(name, email, password);
    await storage.setItem('auth_token', result.token);
    await storage.setItem('auth_user', JSON.stringify(result.user));
    dispatch({ type: 'SET_AUTH', payload: result });
  }, []);

  const logout = useCallback(async () => {
    await storage.removeItem('auth_token');
    await storage.removeItem('auth_user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    if (state.user) {
      const updated = { ...state.user, ...data };
      storage.setItem('auth_user', JSON.stringify(updated));
      dispatch({ type: 'UPDATE_USER', payload: data });
    }
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
