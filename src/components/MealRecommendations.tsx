import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Clock, Users, TrendingDown, Heart, ChefHat } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const allMeals = [
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
  },
  {
    id: 4,
    name: "Greek Yogurt Parfait",
    culture: "Mediterranean",
    glucoseImpact: "very low",
    prepTime: "5 min",
    calories: 220,
    protein: 20,
    carbs: 18,
    fiber: 4,
    description: "Protein-rich Greek yogurt with berries and nuts",
    compatibility: 88,
  },
  {
    id: 5,
    name: "Zucchini Noodles with Pesto",
    culture: "Italian",
    glucoseImpact: "very low",
    prepTime: "15 min",
    calories: 280,
    protein: 12,
    carbs: 8,
    fiber: 6,
    description: "Low-carb zucchini noodles with fresh basil pesto",
    compatibility: 91,
  },
  {
    id: 6,
    name: "Turkey and Avocado Wrap",
    culture: "American",
    glucoseImpact: "moderate",
    prepTime: "10 min",
    calories: 380,
    protein: 28,
    carbs: 32,
    fiber: 8,
    description: "Whole grain wrap with lean turkey and fresh avocado",
    compatibility: 85,
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
  meals?: typeof allMeals;
}

const MealRecommendations = ({ className = "", meals }: MealRecommendationsProps) => {
  const { addMealToPlan } = useAuth();
  const { toast } = useToast();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<typeof allMeals[0] | null>(null);
  
  const displayMeals = meals || allMeals.slice(0, 3);
  
  const handleAddToPlan = (meal: typeof allMeals[0]) => {
    addMealToPlan(meal);
    toast({
      title: "Added to plan!",
      description: `${meal.name} has been added to your daily plan.`
    });
  };
  
  const handleShowDetails = (meal: typeof allMeals[0]) => {
    setSelectedMeal(meal);
    setIsDetailModalOpen(true);
  };
  
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-primary" />
            Curated Recommendations
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Handpicked by our nutritionists</p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayMeals.map((meal) => (
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
                <Button size="sm" className="flex-1" onClick={() => handleAddToPlan(meal)}>
                  Add to Plan
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleShowDetails(meal)}>
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meal Details Modal */}
      <AlertDialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedMeal?.name}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>{selectedMeal?.description}</p>
                
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{selectedMeal?.calories}</div>
                    <div className="text-sm text-muted-foreground">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{selectedMeal?.prepTime}</div>
                    <div className="text-sm text-muted-foreground">Prep Time</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-semibold">{selectedMeal?.protein}g</div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                  <div>
                    <div className="font-semibold">{selectedMeal?.carbs}g</div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                  </div>
                  <div>
                    <div className="font-semibold">{selectedMeal?.fiber}g</div>
                    <div className="text-xs text-muted-foreground">Fiber</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Recipe Steps:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    <li>1. Prepare all ingredients and preheat cooking equipment</li>
                    <li>2. Follow the preparation method for optimal nutrition retention</li>
                    <li>3. Cook according to recommended time and temperature</li>
                    <li>4. Serve immediately for best taste and glucose impact</li>
                  </ol>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsDetailModalOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MealRecommendations;