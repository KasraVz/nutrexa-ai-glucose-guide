import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, CalendarDays, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Meal {
  id: string;
  name: string;
  ingredients: string[];
  calories?: number;
  carbs?: number;
  protein?: number;
  notes?: string;
}

interface DayPlan {
  breakfast?: Meal;
  lunch?: Meal;
  dinner?: Meal;
  snacks?: Meal[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MyPlan = () => {
  const navigate = useNavigate();
  const { user, updateProfile, dailyPlan, weekPlan: contextWeekPlan, setWeekPlan: setContextWeekPlan } = useAuth();
  const { toast } = useToast();
  
  const [weekPlan, setWeekPlan] = useState<Record<string, DayPlan>>({});
  const [activeDay, setActiveDay] = useState('Monday');
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    name: '',
    ingredients: [],
    notes: ''
  });
  const [currentMealType, setCurrentMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');
  const [ingredientInput, setIngredientInput] = useState('');

  // Initialize weekPlan from context
  useEffect(() => {
    if (contextWeekPlan && Object.keys(contextWeekPlan).length > 0) {
      setWeekPlan(contextWeekPlan);
    }
  }, []);

  // Sync weekPlan to context whenever it changes
  useEffect(() => {
    if (Object.keys(weekPlan).length > 0) {
      setContextWeekPlan(weekPlan);
    }
  }, [weekPlan]);

  const addIngredient = () => {
    if (ingredientInput.trim() && newMeal.ingredients) {
      setNewMeal({
        ...newMeal,
        ingredients: [...newMeal.ingredients, ingredientInput.trim()]
      });
      setIngredientInput('');
    }
  };

  const removeIngredient = (index: number) => {
    if (newMeal.ingredients) {
      setNewMeal({
        ...newMeal,
        ingredients: newMeal.ingredients.filter((_, i) => i !== index)
      });
    }
  };

  const saveMeal = () => {
    if (!newMeal.name?.trim()) {
      toast({
        title: "Missing meal name",
        description: "Please enter a name for your meal",
        variant: "destructive"
      });
      return;
    }

    const meal: Meal = {
      id: Date.now().toString(),
      name: newMeal.name,
      ingredients: newMeal.ingredients || [],
      calories: newMeal.calories,
      carbs: newMeal.carbs,
      protein: newMeal.protein,
      notes: newMeal.notes
    };

    const dayPlan = weekPlan[activeDay] || {};
    
    if (currentMealType === 'snacks') {
      dayPlan.snacks = [...(dayPlan.snacks || []), meal];
    } else {
      dayPlan[currentMealType] = meal;
    }

    setWeekPlan({
      ...weekPlan,
      [activeDay]: dayPlan
    });

    // Reset form
    setNewMeal({ name: '', ingredients: [], notes: '' });
    setShowAddMeal(false);
    
    toast({
      title: "Meal added!",
      description: `${meal.name} has been added to your ${activeDay} plan.`
    });
  };

  const deleteMeal = (mealType: keyof DayPlan, mealId?: string) => {
    const dayPlan = { ...weekPlan[activeDay] };
    
    if (mealType === 'snacks' && mealId) {
      dayPlan.snacks = dayPlan.snacks?.filter(snack => snack.id !== mealId);
    } else {
      delete dayPlan[mealType];
    }
    
    setWeekPlan({
      ...weekPlan,
      [activeDay]: dayPlan
    });
  };

  const addAiMealToDay = (aiMeal: any, day: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const meal: Meal = {
      id: Date.now().toString(),
      name: aiMeal.name,
      ingredients: aiMeal.ingredients || [],
      calories: aiMeal.calories,
      carbs: aiMeal.carbs,
      protein: aiMeal.protein,
      notes: aiMeal.description
    };

    const dayPlan = weekPlan[day] || {};
    dayPlan[mealType] = meal;

    setWeekPlan({
      ...weekPlan,
      [day]: dayPlan
    });

    toast({
      title: "Meal added!",
      description: `${meal.name} has been added to ${day}'s ${mealType}.`
    });
  };

  const currentDayPlan = weekPlan[activeDay] || {};

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <CalendarDays className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">My Diet Plan</h1>
        </div>

        {/* AI Generated Plan */}
        {dailyPlan && dailyPlan.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Generated Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dailyPlan.map((meal, index) => (
                  <div key={index} className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
                    <div>
                      <h3 className="font-medium mb-2">{meal.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{meal.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary font-medium">{meal.calories} cal</span>
                        <Badge variant="secondary">{meal.culture}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-muted-foreground mb-1">Add to {activeDay}:</p>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-xs"
                          onClick={() => addAiMealToDay(meal, activeDay, 'breakfast')}
                        >
                          Breakfast
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-xs"
                          onClick={() => addAiMealToDay(meal, activeDay, 'lunch')}
                        >
                          Lunch
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-xs"
                          onClick={() => addAiMealToDay(meal, activeDay, 'dinner')}
                        >
                          Dinner
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Day Selector */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Select Day</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {DAYS.map(day => (
                  <Button
                    key={day}
                    variant={activeDay === day ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveDay(day)}
                  >
                    {day}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Meal Planning */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{activeDay} Plan</h2>
              <Button onClick={() => setShowAddMeal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Meal
              </Button>
            </div>

            {/* Meal Cards */}
            <div className="space-y-6">
              {/* Breakfast */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Breakfast</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentDayPlan.breakfast ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{currentDayPlan.breakfast.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMeal('breakfast')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {currentDayPlan.breakfast.ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {currentDayPlan.breakfast.ingredients.map((ingredient, i) => (
                            <Badge key={i} variant="secondary">{ingredient}</Badge>
                          ))}
                        </div>
                      )}
                      {currentDayPlan.breakfast.notes && (
                        <p className="text-sm text-muted-foreground">{currentDayPlan.breakfast.notes}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No breakfast planned</p>
                  )}
                </CardContent>
              </Card>

              {/* Lunch */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lunch</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentDayPlan.lunch ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{currentDayPlan.lunch.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMeal('lunch')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {currentDayPlan.lunch.ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {currentDayPlan.lunch.ingredients.map((ingredient, i) => (
                            <Badge key={i} variant="secondary">{ingredient}</Badge>
                          ))}
                        </div>
                      )}
                      {currentDayPlan.lunch.notes && (
                        <p className="text-sm text-muted-foreground">{currentDayPlan.lunch.notes}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No lunch planned</p>
                  )}
                </CardContent>
              </Card>

              {/* Dinner */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dinner</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentDayPlan.dinner ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{currentDayPlan.dinner.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMeal('dinner')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {currentDayPlan.dinner.ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {currentDayPlan.dinner.ingredients.map((ingredient, i) => (
                            <Badge key={i} variant="secondary">{ingredient}</Badge>
                          ))}
                        </div>
                      )}
                      {currentDayPlan.dinner.notes && (
                        <p className="text-sm text-muted-foreground">{currentDayPlan.dinner.notes}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No dinner planned</p>
                  )}
                </CardContent>
              </Card>

              {/* Snacks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Snacks</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentDayPlan.snacks && currentDayPlan.snacks.length > 0 ? (
                    <div className="space-y-4">
                      {currentDayPlan.snacks.map(snack => (
                        <div key={snack.id} className="space-y-2 p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{snack.name}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMeal('snacks', snack.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {snack.ingredients.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {snack.ingredients.map((ingredient, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{ingredient}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No snacks planned</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Add Meal Modal */}
        {showAddMeal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add New Meal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Meal Type</Label>
                  <div className="flex gap-2 mt-2">
                    {['breakfast', 'lunch', 'dinner', 'snacks'].map(type => (
                      <Button
                        key={type}
                        variant={currentMealType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentMealType(type as any)}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="mealName">Meal Name</Label>
                  <Input
                    id="mealName"
                    value={newMeal.name || ''}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    placeholder="e.g., Grilled Chicken Salad"
                  />
                </div>

                <div>
                  <Label>Ingredients</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={ingredientInput}
                      onChange={(e) => setIngredientInput(e.target.value)}
                      placeholder="Add ingredient"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                    />
                    <Button onClick={addIngredient} size="sm">Add</Button>
                  </div>
                  {newMeal.ingredients && newMeal.ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newMeal.ingredients.map((ingredient, i) => (
                        <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removeIngredient(i)}>
                          {ingredient} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={newMeal.calories || ''}
                      onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) || undefined })}
                      placeholder="300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      value={newMeal.carbs || ''}
                      onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) || undefined })}
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      value={newMeal.protein || ''}
                      onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) || undefined })}
                      placeholder="25"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newMeal.notes || ''}
                    onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                    placeholder="Any special notes or cooking instructions..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={saveMeal} className="flex-1">Save Meal</Button>
                  <Button variant="outline" onClick={() => setShowAddMeal(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPlan;