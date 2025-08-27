import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Flame } from 'lucide-react';

interface Achievement {
  title: string;
  badge: 'gold' | 'silver' | 'bronze';
  icon: 'trophy' | 'star' | 'target' | 'flame';
  description: string;
}

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements = ({ achievements }: AchievementsProps) => {
  const getIcon = (icon: Achievement['icon']) => {
    const iconProps = { className: "h-5 w-5" };
    switch (icon) {
      case 'trophy': return <Trophy {...iconProps} />;
      case 'star': return <Star {...iconProps} />;
      case 'target': return <Target {...iconProps} />;
      case 'flame': return <Flame {...iconProps} />;
      default: return <Trophy {...iconProps} />;
    }
  };

  const getBadgeColor = (badge: Achievement['badge']) => {
    switch (badge) {
      case 'gold': return 'bg-accent-gold text-accent-gold-foreground';
      case 'silver': return 'bg-muted text-muted-foreground';
      case 'bronze': return 'bg-accent/20 text-accent-foreground';
      default: return 'bg-accent-gold text-accent-gold-foreground';
    }
  };

  if (achievements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent-gold" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Keep tracking your health to unlock achievements!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent-gold" />
          Your Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-card border"
            >
              <div className={`p-2 rounded-full ${getBadgeColor(achievement.badge)}`}>
                {getIcon(achievement.icon)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{achievement.title}</h4>
                  <Badge variant="secondary" className={`text-xs ${getBadgeColor(achievement.badge)}`}>
                    {achievement.badge}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Achievements;