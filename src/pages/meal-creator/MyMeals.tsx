import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, ChefHat, X } from 'lucide-react';

const mealSchema = z.object({
  name: z.string().min(1, 'Meal name is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  ingredients: z.array(z.object({ value: z.string().min(1) })).min(1, 'At least one ingredient required'),
  calories: z.coerce.number().min(0).max(3000),
  carbs: z.coerce.number().min(0).max(500),
  fats: z.coerce.number().min(0).max(200),
  protein: z.coerce.number().min(0).max(200),
  fiber: z.coerce.number().min(0).max(100).optional(),
  culture: z.string().min(1, 'Please select a culture'),
  prepTime: z.string().min(1, 'Prep time is required'),
  glucoseImpact: z.string().min(1, 'Please select glucose impact'),
});

type MealForm = z.infer<typeof mealSchema>;

const MyMeals = () => {
  const { creatorMeals, addMealToMarketplace } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MealForm>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: '',
      description: '',
      ingredients: [{ value: '' }],
      calories: 0,
      carbs: 0,
      fats: 0,
      protein: 0,
      fiber: 0,
      culture: '',
      prepTime: '',
      glucoseImpact: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ingredients',
  });

  const onSubmit = async (data: MealForm) => {
    setIsLoading(true);
    try {
      const mealData = {
        name: data.name,
        description: data.description,
        ingredients: data.ingredients.map(i => i.value),
        calories: data.calories,
        carbs: data.carbs,
        fats: data.fats,
        protein: data.protein,
        fiber: data.fiber || 0,
        culture: data.culture,
        prepTime: data.prepTime,
        glucoseImpact: data.glucoseImpact,
      };
      
      await addMealToMarketplace(mealData);
      
      toast({
        title: "Meal added!",
        description: `${data.name} has been added to the marketplace.`,
      });
      
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add meal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Meals</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your meal plans
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Meal</DialogTitle>
              <DialogDescription>
                Add a new nutritious meal to the marketplace
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Meal Name *</Label>
                <Input id="name" {...form.register('name')} />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" {...form.register('description')} />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Ingredients *</Label>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      {...form.register(`ingredients.${index}.value`)}
                      placeholder="e.g., 200g salmon fillet"
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ value: '' })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
                {form.formState.errors.ingredients && (
                  <p className="text-sm text-destructive">{form.formState.errors.ingredients.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories *</Label>
                  <Input id="calories" type="number" {...form.register('calories')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g) *</Label>
                  <Input id="carbs" type="number" {...form.register('carbs')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g) *</Label>
                  <Input id="protein" type="number" {...form.register('protein')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fats">Fats (g) *</Label>
                  <Input id="fats" type="number" {...form.register('fats')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiber">Fiber (g)</Label>
                  <Input id="fiber" type="number" {...form.register('fiber')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prepTime">Prep Time *</Label>
                  <Input id="prepTime" placeholder="e.g., 25 min" {...form.register('prepTime')} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="culture">Culture *</Label>
                  <Select onValueChange={(value) => form.setValue('culture', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select culture" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="Asian">Asian</SelectItem>
                      <SelectItem value="Indian">Indian</SelectItem>
                      <SelectItem value="Italian">Italian</SelectItem>
                      <SelectItem value="American">American</SelectItem>
                      <SelectItem value="Mexican">Mexican</SelectItem>
                      <SelectItem value="Middle Eastern">Middle Eastern</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.culture && (
                    <p className="text-sm text-destructive">{form.formState.errors.culture.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="glucoseImpact">Glucose Impact *</Label>
                  <Select onValueChange={(value) => form.setValue('glucoseImpact', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Very Low">Very Low</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.glucoseImpact && (
                    <p className="text-sm text-destructive">{form.formState.errors.glucoseImpact.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Meal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Created Meals
          </CardTitle>
          <CardDescription>
            {creatorMeals.length} meal{creatorMeals.length !== 1 ? 's' : ''} in the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          {creatorMeals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No meals created yet.</p>
              <p className="text-sm mt-2">Create your first meal to get started!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Culture</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Carbs</TableHead>
                  <TableHead>Protein</TableHead>
                  <TableHead>Fats</TableHead>
                  <TableHead>Glucose Impact</TableHead>
                  <TableHead>Usage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creatorMeals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell className="font-medium">{meal.name}</TableCell>
                    <TableCell>{meal.culture}</TableCell>
                    <TableCell>{meal.calories}</TableCell>
                    <TableCell>{meal.carbs}g</TableCell>
                    <TableCell>{meal.protein}g</TableCell>
                    <TableCell>{meal.fats}g</TableCell>
                    <TableCell>{meal.glucoseImpact}</TableCell>
                    <TableCell>{meal.usageCount} times</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyMeals;
