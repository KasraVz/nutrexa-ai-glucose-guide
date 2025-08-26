import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera, Plus, Clock, TrendingUp } from "lucide-react";

const recentMeals = [
  {
    id: 1,
    name: "Greek Yogurt with Berries",
    time: "8:30 AM",
    glucoseResponse: "+25 mg/dL",
    impact: "low",
    calories: 180
  },
  {
    id: 2,
    name: "Grilled Chicken Salad",
    time: "12:45 PM", 
    glucoseResponse: "+18 mg/dL",
    impact: "low",
    calories: 320
  },
  {
    id: 3,
    name: "Apple with Almond Butter",
    time: "3:20 PM",
    glucoseResponse: "+32 mg/dL",
    impact: "moderate",
    calories: 190
  }
];

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'low': return 'bg-success/10 text-success border-success/20';
    case 'moderate': return 'bg-warning/10 text-warning border-warning/20';
    case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
    default: return 'bg-muted text-muted-foreground';
  }
};

interface FoodLoggerProps {
  className?: string;
}

const FoodLogger = ({ className = "" }: FoodLoggerProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Log Your Meal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Log Section */}
          <div className="flex gap-2">
            <Input
              placeholder="Search foods or describe your meal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button size="icon" variant="outline">
              <Camera className="h-4 w-4" />
            </Button>
            <Button>
              Log Meal
            </Button>
          </div>

          {/* Recent Meals */}
          <div>
            <h4 className="font-medium mb-3 text-foreground">Recent Meals & Responses</h4>
            <div className="space-y-2">
              {recentMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-sm text-foreground">{meal.name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {meal.time}
                      <span>•</span>
                      {meal.calories} cal
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getImpactColor(meal.impact)}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {meal.glucoseResponse}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodLogger;