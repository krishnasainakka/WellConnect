import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, username: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('wellconnect_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Transform backend user data to frontend User type
  const transformBackendUser = (backendUser: any): User => ({
    id: backendUser._id || backendUser.id,
    email: backendUser.email,
    username: backendUser.username,
    isActive: backendUser.isActive ?? true,
    lastLogin: new Date(backendUser.lastLogin),
    createdAt: new Date(backendUser.createdAt),
    updatedAt: new Date(backendUser.updatedAt),

    badges: backendUser.badges?.map((badge: any) => ({
        id: badge.badgeId,
        earnedAt: new Date(badge.earnedDate),
    })) || [],

    stats: {
        totalSessions: backendUser.stats?.totalSessions || 0,
        avgCommunicationScore: backendUser.stats?.avgCommunicationScore || 0,
        timeSpentPracticing: backendUser.stats?.timeSpentPracticing || 0,
        numberOfBadges: backendUser.stats?.numberOfBadges || 0,
        streakDays: backendUser.stats?.currentStreak || 0,
    }
    });



  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData = transformBackendUser(data.data);

        setUser(userData);
        localStorage.setItem('wellconnect_user', JSON.stringify(userData));
        localStorage.setItem('wellconnect_token', data.token);

        console.log('✅ User logged in successfully');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData = transformBackendUser(data.data);

        // Save user and token
        setUser(userData);
        localStorage.setItem('wellconnect_user', JSON.stringify(userData));
        localStorage.setItem('wellconnect_token', data.token);

        console.log(' User registered successfully');
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error(' Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('wellconnect_user');
    localStorage.removeItem('wellconnect_token');
    console.log(' User logged out');
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};