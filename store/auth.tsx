





// store/auth.tsx
import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types';
import { API_BASE_URL } from '@/constants/api';

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  registrationEmail: string | null; // Store email for OTP verification
};

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTH'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_REGISTRATION_EMAIL'; payload: string | null };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  registrationEmail: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_AUTH':
      return { 
        ...state, 
        user: action.payload.user, 
        token: action.payload.token, 
        isLoading: false, 
        isAuthenticated: true,
        registrationEmail: null 
      };
    case 'LOGOUT':
      return { user: null, token: null, isLoading: false, isAuthenticated: false, registrationEmail: null };
    case 'UPDATE_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
    case 'SET_REGISTRATION_EMAIL':
      return { ...state, registrationEmail: action.payload };
    default:
      return state;
  }
}

type AuthContextType = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage abstraction
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
    try {
      const url = `${API_BASE_URL}/login`;
      console.log('🔍 Login URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server returned invalid response. Status: ${response.status}`);
      }

      // Check if OTP is required
      if (response.status === 403 && data.requiresOTP) {
        dispatch({ type: 'SET_REGISTRATION_EMAIL', payload: data.email });
        throw new Error('Please verify your email first');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      await storage.setItem('auth_token', data.token);
      await storage.setItem('auth_user', JSON.stringify(data.user));

      const user: User = {
        id: data.user.id.toString(),
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '',
        avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
        isPremium: false,
      };

      dispatch({ type: 'SET_AUTH', payload: { user, token: data.token } });
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
    try {
      const url = `${API_BASE_URL}/register`;
      console.log('🔍 Registration URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server returned invalid response. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store email for OTP verification
      dispatch({ type: 'SET_REGISTRATION_EMAIL', payload: data.email });

      return data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }, []);

  const verifyOTP = useCallback(async (email: string, otp: string) => {
    try {
      const url = `${API_BASE_URL}/verify-otp`;
      console.log('🔍 Verify OTP URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server returned invalid response. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      // Store token and user data
      await storage.setItem('auth_token', data.token);
      await storage.setItem('auth_user', JSON.stringify(data.user));

      const user: User = {
        id: data.user.id.toString(),
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '',
        avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
        isPremium: false,
      };

      dispatch({ type: 'SET_AUTH', payload: { user, token: data.token } });
    } catch (error) {
      console.error('❌ OTP verification error:', error);
      throw error;
    }
  }, []);

  const resendOTP = useCallback(async (email: string) => {
    try {
      const url = `${API_BASE_URL}/resend-otp`;
      console.log('🔍 Resend OTP URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server returned invalid response. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      return data;
    } catch (error) {
      console.error('❌ Resend OTP error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    console.log('🔍 Logging out...');
    await storage.removeItem('auth_token');
    await storage.removeItem('auth_user');
    dispatch({ type: 'LOGOUT' });
    console.log('✅ Logout successful');
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    if (state.user) {
      const updated = { ...state.user, ...data };
      storage.setItem('auth_user', JSON.stringify(updated));
      dispatch({ type: 'UPDATE_USER', payload: data });
    }
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ 
      state, 
      login, 
      register, 
      verifyOTP, 
      resendOTP, 
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}