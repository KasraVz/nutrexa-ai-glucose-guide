import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, Zap, Award } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "stable";
  icon: React.ReactNode;
  color?: string;
}

const StatCard = ({ title, value, subtitle, trend, icon, color = "primary" }: StatCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "down":
        return <TrendingUp className="h-4 w-4 text-destructive rotate-180" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {getTrendIcon()}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-${color}/10`}>
            <div className={`text-${color}`}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface QuickStatsProps {
  className?: string;
}

const QuickStats = ({ className = "" }: QuickStatsProps) => {
  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      <StatCard
        title="Average Glucose"
        value="118"
        subtitle="mg/dL (last 7 days)"
        trend="down"
        icon={<Target className="h-6 w-6" />}
        color="primary"
      />
      
      <StatCard
        title="Time in Range"
        value="87%"
        subtitle="Target: 70-140 mg/dL"
        trend="up"
        icon={<Zap className="h-6 w-6" />}
        color="success"
      />
      
      <StatCard
        title="Glucose Variability"
        value="Low"
        subtitle="Consistent levels"
        trend="stable"
        icon={<TrendingUp className="h-6 w-6" />}
        color="accent"
      />
      
      <StatCard
        title="Nutrition Score"
        value="92"
        subtitle="This week"
        trend="up"
        icon={<Award className="h-6 w-6" />}
        color="primary"
      />
    </div>
  );
};

export default QuickStats;