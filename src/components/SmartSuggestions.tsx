import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, TrendingUp, Activity, Droplets, Moon, Utensils } from 'lucide-react';
import { UserProfile } from '@/contexts/AuthContext';

interface SmartSuggestionsProps {
  userProfile?: UserProfile;
  currentGlucose?: number;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SmartSuggestions = ({ userProfile, currentGlucose = 95 }: SmartSuggestionsProps) => {
  const generateSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    const currentHour = new Date().getHours();
    const primaryGoal = userProfile?.primaryGoal || '';

    // Time-based suggestions
    if (currentHour >= 6 && currentHour < 10) {
      suggestions.push({
        id: 'morning-protein',
        title: 'Start with Protein',
        description: 'A protein-rich breakfast helps stabilize glucose throughout the morning.',
        icon: <Utensils className="h-5 w-5 text-primary" />,
      });
    } else if (currentHour >= 12 && currentHour < 15) {
      suggestions.push({
        id: 'post-lunch-walk',
        title: 'Post-Lunch Walk',
        description: 'A 10-minute walk after meals can help reduce glucose spikes by 15-20%.',
        icon: <Activity className="h-5 w-5 text-primary" />,
      });
    } else if (currentHour >= 18) {
      suggestions.push({
        id: 'early-dinner',
        title: 'Consider Earlier Dinner',
        description: 'Eating dinner 3+ hours before bed improves overnight glucose control.',
        icon: <Moon className="h-5 w-5 text-primary" />,
      });
    }

    // Glucose-based suggestions
    if (currentGlucose > 140) {
      suggestions.push({
        id: 'hydration',
        title: 'Increase Hydration',
        description: 'Drinking water helps your kidneys flush out excess glucose naturally.',
        icon: <Droplets className="h-5 w-5 text-primary" />,
      });
    } else if (currentGlucose >= 70 && currentGlucose <= 120) {
      suggestions.push({
        id: 'great-control',
        title: 'Excellent Control!',
        description: 'Your glucose is in the optimal range. Keep up your current routine!',
        icon: <TrendingUp className="h-5 w-5 text-success" />,
      });
    }

    // Goal-based suggestions
    if (primaryGoal?.includes('diabetes')) {
      suggestions.push({
        id: 'fiber-intake',
        title: 'Add More Fiber',
        description: 'Aim for 5g+ fiber per meal to reduce post-meal glucose spikes.',
        icon: <Utensils className="h-5 w-5 text-primary" />,
      });
    } else if (primaryGoal === 'weight-management') {
      suggestions.push({
        id: 'portion-awareness',
        title: 'Mindful Portions',
        description: 'Using smaller plates can naturally reduce calorie intake by 20%.',
        icon: <Utensils className="h-5 w-5 text-primary" />,
      });
    } else if (primaryGoal === 'sports-nutrition') {
      suggestions.push({
        id: 'pre-workout',
        title: 'Pre-Workout Timing',
        description: 'A small carb snack 30-60 minutes before exercise optimizes performance.',
        icon: <Activity className="h-5 w-5 text-primary" />,
      });
    }

    // Activity-based suggestions
    if (userProfile?.activityLevel === 'sedentary') {
      suggestions.push({
        id: 'movement-breaks',
        title: 'Take Movement Breaks',
        description: 'Stand and stretch every hour to improve insulin sensitivity.',
        icon: <Activity className="h-5 w-5 text-primary" />,
      });
    }

    // Return top 3 most relevant suggestions
    return suggestions.slice(0, 3);
  };

  const suggestions = generateSuggestions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-accent-gold" />
          Smart Suggestions for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="mt-0.5">{suggestion.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
                <p className="text-xs text-muted-foreground">{suggestion.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartSuggestions;
