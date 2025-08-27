import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Heart, Zap } from 'lucide-react';

interface HealthSummaryProps {
  userName: string;
  currentGlucose?: number;
}

const HealthSummary = ({ userName, currentGlucose = 95 }: HealthSummaryProps) => {
  const getHealthMessage = (glucose: number) => {
    if (glucose >= 70 && glucose <= 140) {
      return {
        message: `Your glucose has been stable today. You're doing great! Here's a meal that will help you maintain this energy.`,
        icon: <TrendingUp className="h-5 w-5 text-success" />,
        bgColor: "bg-success/10",
        textColor: "text-success"
      };
    } else if (glucose > 140 && glucose <= 180) {
      return {
        message: `Your glucose is slightly elevated. A light walk and some water might help bring it down naturally.`,
        icon: <Heart className="h-5 w-5 text-warning" />,
        bgColor: "bg-warning/10",
        textColor: "text-warning"
      };
    } else {
      return {
        message: `Your glucose needs attention. Please follow your healthcare provider's guidance and consider the meal suggestions below.`,
        icon: <Zap className="h-5 w-5 text-destructive" />,
        bgColor: "bg-destructive/10",
        textColor: "text-destructive"
      };
    }
  };

  const healthStatus = getHealthMessage(currentGlucose);

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