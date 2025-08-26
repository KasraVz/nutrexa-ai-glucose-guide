import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  profile?: UserProfile;
}

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  diabetesType: 'type1' | 'type2' | 'prediabetes' | '';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  sleepHours: number;
  allergies: string[];
  tastePreferences: string[];
  culturalPreferences: string[];
  medications: string[];
  isPublic: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (profile: UserProfile) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
  justSignedUp: boolean;
  setJustSignedUp: (signedUp: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);

  const signIn = async (email: string, password: string) => {
    // Mock authentication - in real app this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
    };
    
    setUser(mockUser);
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Mock registration - in real app this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const mockUser: User = {
      id: '1',
      email,
      name,
    };
    
    setUser(mockUser);
    setJustSignedUp(true);
  };

  const signOut = () => {
    setUser(null);
    setHasCompletedOnboarding(false);
    setJustSignedUp(false);
  };

  const updateProfile = (profile: UserProfile) => {
    if (user) {
      setUser({ ...user, profile });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
    hasCompletedOnboarding,
    setHasCompletedOnboarding,
    justSignedUp,
    setJustSignedUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};