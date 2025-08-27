import { toast } from 'sonner';

export const notifications = {
  mealReminder: (mealType: 'breakfast' | 'lunch' | 'dinner', suggestion?: string) => {
    const suggestions = {
      breakfast: 'A protein-rich smoothie would be perfect to start your day!',
      lunch: 'A chicken salad would be a great choice to keep your energy stable.',
      dinner: 'Consider grilled fish with vegetables for a balanced evening meal.'
    };
    
    toast(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)}time is approaching!`, {
      description: suggestion || suggestions[mealType],
      duration: 5000,
    });
  },

  glucoseAlert: (level: number, suggestion: string) => {
    toast('Glucose Level Alert', {
      description: `Current level: ${level} mg/dL. ${suggestion}`,
      duration: 8000,
    });
  },

  achievement: (title: string, description: string) => {
    toast('🏆 Achievement Unlocked!', {
      description: `${title}: ${description}`,
      duration: 6000,
    });
  },

  healthTip: (tip: string) => {
    toast('💡 Health Tip', {
      description: tip,
      duration: 4000,
    });
  },

  medicationReminder: (medication: string, time: string) => {
    toast('💊 Medication Reminder', {
      description: `Time to take your ${medication} at ${time}`,
      duration: 10000,
    });
  }
};

export default notifications;