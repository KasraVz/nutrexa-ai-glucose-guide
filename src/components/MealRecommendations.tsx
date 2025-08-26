import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, TrendingDown, Heart, ChefHat } from "lucide-react";

const sampleMeals = [
  {
    id: 1,
    name: "Grilled Salmon with Quinoa",
    culture: "Mediterranean",
    glucoseImpact: "low",
    prepTime: "25 min",
    calories: 420,
    protein: 32,
    carbs: 28,
    fiber: 6,
    description: "Omega-3 rich salmon with fiber-packed quinoa and roasted vegetables",
    compatibility: 95,
  },
  {
    id: 2,
    name: "Chicken Tikka with Cauliflower Rice",
    culture: "Indian",
    glucoseImpact: "low",
    prepTime: "30 min",
    calories: 380,
    protein: 35,
    carbs: 15,
    fiber: 8,
    description: "Protein-rich chicken in aromatic spices with low-carb cauliflower rice",
    compatibility: 92,
  },
  {
    id: 3,
    name: "Asian Lettuce Wraps with Tofu",
    culture: "Asian",
    glucoseImpact: "very low",
    prepTime: "20 min",
    calories: 290,
    protein: 18,
    carbs: 12,
    fiber: 5,
    description: "Fresh, crispy lettuce wraps with seasoned tofu and vegetables",
    compatibility: 89,
  }
];

const getGlucoseImpactColor = (impact: string) => {
  switch (impact) {
    case 'very low': return 'bg-success text-success-foreground';
    case 'low': return 'bg-success/70 text-success-foreground';
    case 'moderate': return 'bg-warning text-warning-foreground';
    case 'high': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

interface MealRecommendationsProps {
  className?: string;
}

const MealRecommendations = ({ className = "" }: MealRecommendationsProps) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-primary" />
          Recommended for You
        </h2>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sampleMeals.map((meal) => (
          <Card key={meal.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-tight">{meal.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm font-medium text-primary">
                  <Heart className="h-4 w-4" />
                  {meal.compatibility}%
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{meal.description}</p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{meal.culture}</Badge>
                <Badge className={getGlucoseImpactColor(meal.glucoseImpact)}>
                  <TrendingDown className="h-3 w-3 mr-1" />
                  {meal.glucoseImpact} impact
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {meal.prepTime}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {meal.calories} cal
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs text-center mb-4 bg-muted/50 rounded-lg p-2">
                <div>
                  <div className="font-semibold text-foreground">{meal.protein}g</div>
                  <div className="text-muted-foreground">Protein</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{meal.carbs}g</div>
                  <div className="text-muted-foreground">Carbs</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{meal.fiber}g</div>
                  <div className="text-muted-foreground">Fiber</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  Add to Plan
                </Button>
                <Button size="sm" variant="outline">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MealRecommendations;