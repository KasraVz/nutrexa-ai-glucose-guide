import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, TrendingUp, Clock, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface QuickLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickLogDialog = ({ open, onOpenChange }: QuickLogDialogProps) => {
  const [foodName, setFoodName] = useState('');
  const [estimatedCarbs, setEstimatedCarbs] = useState('');
  const [showSimulation, setShowSimulation] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const { toast } = useToast();
  const { simulateGlucoseImpact } = useAuth();

  const handleQuickLog = () => {
    if (!foodName.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a food name.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Meal Logged!',
      description: `${foodName} has been added to your food log.`,
    });

    resetForm();
  };

  const handleSimulate = () => {
    if (!foodName.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a food name.',
        variant: 'destructive',
      });
      return;
    }

    const carbs = parseInt(estimatedCarbs) || 30; // Default to 30g if not provided
    const result = simulateGlucoseImpact(carbs);
    setSimulationResult(result);
    setShowSimulation(true);
  };

  const resetForm = () => {
    setFoodName('');
    setEstimatedCarbs('');
    setShowSimulation(false);
    setSimulationResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent-gold" />
            Quick Log / Simulate
          </DialogTitle>
          <DialogDescription>
            Quickly log a meal or simulate its glucose impact
          </DialogDescription>
        </DialogHeader>

        {!showSimulation ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="foodName">Food / Meal Name *</Label>
              <Input
                id="foodName"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g., Chicken salad, Apple, Rice bowl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Estimated Carbs (g) - Optional</Label>
              <Input
                id="carbs"
                type="number"
                value={estimatedCarbs}
                onChange={(e) => setEstimatedCarbs(e.target.value)}
                placeholder="e.g., 45"
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                Leave blank for default estimate
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleQuickLog}
                className="flex-1"
              >
                Log Now
              </Button>
              <Button
                type="button"
                onClick={handleSimulate}
                className="flex-1"
              >
                <Activity className="mr-2 h-4 w-4" />
                Simulate Impact
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Predicted Glucose Impact for "{foodName}"
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                    <Activity className="h-5 w-5 text-warning mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Expected Rise</p>
                      <p className="text-sm text-muted-foreground">
                        {simulationResult?.rise}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Peak Expected</p>
                      <p className="text-sm text-muted-foreground">
                        {simulationResult?.peak}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
                  💡 Tip: A 10-minute walk after eating can reduce this spike by 15-20%
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSimulation(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleQuickLog();
                  setShowSimulation(false);
                }}
                className="flex-1"
              >
                Log This Meal
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickLogDialog;
