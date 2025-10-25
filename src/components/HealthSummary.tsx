import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Heart, Zap, Target, Activity } from 'lucide-react';
import { UserProfile } from '@/contexts/AuthContext';

interface HealthSummaryProps {
  userName: string;
  currentGlucose?: number;
  userProfile?: UserProfile;
}

const HealthSummary = ({ userName, currentGlucose = 95, userProfile }: HealthSummaryProps) => {
  const getHealthMessage = (glucose: number, profile?: UserProfile) => {
    const goalContext = profile?.primaryGoal?.includes('diabetes') 
      ? 'diabetes management' 
      : profile?.primaryGoal === 'sports-nutrition'
      ? 'athletic performance'
      : profile?.primaryGoal === 'weight-management'
      ? 'weight management'
      : 'health goals';
    
    const activityBonus = profile?.activityLevel === 'active' || profile?.activityLevel === 'very-active'
      ? ' Your active lifestyle is really paying off!'
      : profile?.activityLevel === 'sedentary'
      ? ' Consider adding light activity to boost your results.'
      : ' Keep up these great habits!';

    if (glucose >= 70 && glucose <= 140) {
      return {
        message: `Excellent work on your ${goalContext}! Your glucose is stable at ${glucose} mg/dL.${activityBonus}`,
        icon: <TrendingUp className="h-5 w-5 text-success" />,
        bgColor: "bg-success/10",
        textColor: "text-success"
      };
    } else if (glucose > 140 && glucose <= 180) {
      return {
        message: `Your ${goalContext} is on track, though glucose is slightly elevated at ${glucose} mg/dL. A light walk and hydration can help.`,
        icon: <Heart className="h-5 w-5 text-warning" />,
        bgColor: "bg-warning/10",
        textColor: "text-warning"
      };
    } else if (glucose < 70) {
      return {
        message: `Low glucose alert (${glucose} mg/dL). Please have 15g fast-acting carbs immediately and recheck in 15 minutes.`,
        icon: <Zap className="h-5 w-5 text-destructive" />,
        bgColor: "bg-destructive/10",
        textColor: "text-destructive"
      };
    } else {
      return {
        message: `Your glucose (${glucose} mg/dL) needs attention for your ${goalContext}. Follow your care plan and consider the meal suggestions below.`,
        icon: <Zap className="h-5 w-5 text-destructive" />,
        bgColor: "bg-destructive/10",
        textColor: "text-destructive"
      };
    }
  };

  const healthStatus = getHealthMessage(currentGlucose, userProfile);

  return (
    <Card className={`${healthStatus.bgColor} border-0`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${healthStatus.bgColor}`}>
            {healthStatus.icon}
          </div>
          <div>
            <h3 className={`font-medium ${healthStatus.textColor} mb-1`}>
              Hello {userName}! 👋
            </h3>
            <p className="text-sm text-muted-foreground">
              {healthStatus.message}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthSummary;