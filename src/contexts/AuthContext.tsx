import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Achievement {
  title: string;
  badge: 'gold' | 'silver' | 'bronze';
  icon: 'trophy' | 'star' | 'target' | 'flame';
  description: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'specialist' | 'meal-creator' | null;
  profile?: UserProfile;
  achievements?: Achievement[];
}

export interface SpecialistProfile {
  fullName: string;
  specialization: string;
  degrees: string;
  certifications: string;
  yearsOfExperience: number;
  clinicName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface MealCreatorProfile {
  fullName: string;
  email: string;
  paymentInfo: string;
}

export interface PatientData {
  id: string;
  name: string;
  email: string;
  glucoseData: Array<{ time: string; value: number }>;
}

export interface CreatedMeal {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  calories: number;
  carbs: number;
  fats: number;
  protein: number;
  fiber: number;
  culture: string;
  prepTime: string;
  glucoseImpact: string;
  usageCount: number;
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
  signUp: (email: string, password: string, name: string, role: 'patient' | 'specialist' | 'meal-creator') => Promise<void>;
  signOut: () => void;
  updateProfile: (profile: UserProfile | SpecialistProfile | MealCreatorProfile) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
  justSignedUp: boolean;
  setJustSignedUp: (signedUp: boolean) => void;
  dailyPlan: any[] | null;
  setDailyPlan: (plan: any[] | null) => void;
  addMealToPlan: (meal: any) => void;
  specialistPatients: PatientData[];
  addPatientByUid: (uid: string) => Promise<{ success: boolean; patient?: PatientData; error?: string }>;
  getPatientData: (patientId: string) => PatientData | null;
  creatorMeals: CreatedMeal[];
  addMealToMarketplace: (mealData: Omit<CreatedMeal, 'id' | 'usageCount'>) => Promise<void>;
  earnings: { total: number; pending: number; thisMonth: number; lastPayoutDate: string };
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

// Mock patient data for specialists
const mockPatients: PatientData[] = [
  {
    id: 'patient-uuid-1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    glucoseData: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: Math.floor(Math.random() * 60) + 80
    }))
  },
  {
    id: 'patient-uuid-2',
    name: 'John Smith',
    email: 'john@example.com',
    glucoseData: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: Math.floor(Math.random() * 60) + 90
    }))
  },
  {
    id: 'patient-uuid-3',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    glucoseData: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: Math.floor(Math.random() * 60) + 85
    }))
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);
  const [dailyPlan, setDailyPlan] = useState<any[] | null>(null);
  const [specialistPatients, setSpecialistPatients] = useState<PatientData[]>([]);
  const [creatorMeals, setCreatorMeals] = useState<CreatedMeal[]>([]);
  const [earnings] = useState({
    total: 1234.50,
    pending: 87.25,
    thisMonth: 342.00,
    lastPayoutDate: '2025-10-15'
  });

  const signIn = async (email: string, password: string) => {
    // Mock authentication - in real app this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    // Determine role based on email for demo purposes
    let role: 'patient' | 'specialist' | 'meal-creator' = 'patient';
    if (email.includes('specialist')) {
      role = 'specialist';
    } else if (email.includes('creator') || email.includes('chef')) {
      role = 'meal-creator';
    }
    
    const mockUser: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
      role,
      achievements: role === 'patient' ? [
        {
          title: '7-Day Streak',
          badge: 'gold',
          icon: 'flame',
          description: 'Maintained stable blood sugar for 7 days'
        },
        {
          title: 'Healthy Meals',
          badge: 'silver',
          icon: 'target',
          description: 'Logged 50 nutritious meals'
        }
      ] : []
    };
    
    setUser(mockUser);
  };

  const signUp = async (email: string, password: string, name: string, role: 'patient' | 'specialist' | 'meal-creator') => {
    // Mock registration - in real app this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const mockUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role,
      achievements: []
    };
    
    setUser(mockUser);
    setJustSignedUp(true);
  };

  const signOut = () => {
    setUser(null);
    setHasCompletedOnboarding(false);
    setJustSignedUp(false);
  };

  const updateProfile = (profile: UserProfile | SpecialistProfile | MealCreatorProfile) => {
    if (user) {
      setUser({ ...user, profile: profile as any });
    }
  };

  const addMealToPlan = (meal: any) => {
    if (dailyPlan) {
      setDailyPlan([...dailyPlan, meal]);
    } else {
      setDailyPlan([meal]);
    }
  };

  const addPatientByUid = async (uid: string): Promise<{ success: boolean; patient?: PatientData; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    const patient = mockPatients.find(p => p.id === uid);
    if (patient) {
      if (!specialistPatients.find(p => p.id === uid)) {
        setSpecialistPatients([...specialistPatients, patient]);
        return { success: true, patient };
      }
      return { success: false, error: 'Patient already added' };
    }
    return { success: false, error: 'Patient not found' };
  };

  const getPatientData = (patientId: string): PatientData | null => {
    return specialistPatients.find(p => p.id === patientId) || null;
  };

  const addMealToMarketplace = async (mealData: Omit<CreatedMeal, 'id' | 'usageCount'>) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    const newMeal: CreatedMeal = {
      ...mealData,
      id: crypto.randomUUID(),
      usageCount: 0
    };
    
    setCreatorMeals([...creatorMeals, newMeal]);
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
    dailyPlan,
    setDailyPlan,
    addMealToPlan,
    specialistPatients,
    addPatientByUid,
    getPatientData,
    creatorMeals,
    addMealToMarketplace,
    earnings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};