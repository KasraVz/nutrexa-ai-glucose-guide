import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useAuth, UserProfile } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react';

const onboardingSchema = z.object({
  age: z.coerce.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120'),
  weight: z.coerce.number().min(20, 'Weight must be at least 20 kg').max(500, 'Weight must be less than 500 kg'),
  height: z.coerce.number().min(100, 'Height must be at least 100 cm').max(250, 'Height must be less than 250 cm'),
  diabetesType: z.enum(['type1', 'type2', 'prediabetes'], {
    required_error: 'Please select your diabetes type',
  }),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very-active'], {
    required_error: 'Please select your activity level',
  }),
  sleepHours: z.coerce.number().min(3, 'Sleep hours must be at least 3').max(12, 'Sleep hours must be less than 12'),
  allergies: z.array(z.string()).default([]),
  tastePreferences: z.array(z.string()).default([]),
  culturalPreferences: z.array(z.string()).default([]),
  isPublic: z.boolean().default(false),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

const STEPS = [
  { title: 'Health Conditions', description: 'Tell us about your health status' },
  { title: 'Personal Info', description: 'Basic information about you' },
  { title: 'Lifestyle', description: 'Your daily habits and preferences' },
  { title: 'Preferences', description: 'Food and cultural preferences' },
];

const ALLERGIES = ['Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy'];
const TASTE_PREFERENCES = ['Sweet', 'Spicy', 'Savory', 'Bitter', 'Sour', 'Mild'];
const CULTURAL_PREFERENCES = ['Mediterranean', 'Asian', 'Mexican', 'Indian', 'Italian', 'American'];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { updateProfile, setHasCompletedOnboarding } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      allergies: [],
      tastePreferences: [],
      culturalPreferences: [],
      isPublic: false,
    },
  });

  const onSubmit = (data: OnboardingForm) => {
    const profile: UserProfile = data as UserProfile;
    
    updateProfile(profile);
    setHasCompletedOnboarding(true);
    
    toast({
      title: "Profile completed!",
      description: "Welcome to Nutrexa. Your personalized journey begins now.",
    });
    
    navigate('/');
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Nutrexa</h1>
          </div>
          <div>
            <CardTitle className="text-xl">{STEPS[currentStep].title}</CardTitle>
            <CardDescription>{STEPS[currentStep].description}</CardDescription>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="diabetesType">Diabetes Type</Label>
                  <Select onValueChange={(value) => form.setValue('diabetesType', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your diabetes type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="type1">Type 1 Diabetes</SelectItem>
                      <SelectItem value="type2">Type 2 Diabetes</SelectItem>
                      <SelectItem value="prediabetes">Pre-diabetes</SelectItem>
                      <SelectItem value="disabled" disabled className="text-muted-foreground">
                        Other conditions (Coming soon)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.diabetesType && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.diabetesType.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      {...form.register('age')}
                    />
                    {form.formState.errors.age && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.age.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      {...form.register('weight')}
                    />
                    {form.formState.errors.weight && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.weight.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    {...form.register('height')}
                  />
                  {form.formState.errors.height && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.height.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="activityLevel">Activity Level</Label>
                  <Select onValueChange={(value) => form.setValue('activityLevel', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                      <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="very-active">Very Active (very hard exercise, physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.activityLevel && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.activityLevel.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sleepHours">Average Sleep Hours</Label>
                  <Input
                    id="sleepHours"
                    type="number"
                    min="3"
                    max="12"
                    placeholder="8"
                    {...form.register('sleepHours')}
                  />
                  {form.formState.errors.sleepHours && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.sleepHours.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Food Allergies</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {ALLERGIES.map((allergy) => (
                      <div key={allergy} className="flex items-center space-x-2">
                        <Checkbox
                          id={allergy}
                          onCheckedChange={(checked) => {
                            const current = form.getValues('allergies');
                            if (checked) {
                              form.setValue('allergies', [...current, allergy]);
                            } else {
                              form.setValue('allergies', current.filter(a => a !== allergy));
                            }
                          }}
                        />
                        <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Taste Preferences</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {TASTE_PREFERENCES.map((taste) => (
                      <div key={taste} className="flex items-center space-x-2">
                        <Checkbox
                          id={taste}
                          onCheckedChange={(checked) => {
                            const current = form.getValues('tastePreferences');
                            if (checked) {
                              form.setValue('tastePreferences', [...current, taste]);
                            } else {
                              form.setValue('tastePreferences', current.filter(t => t !== taste));
                            }
                          }}
                        />
                        <Label htmlFor={taste} className="text-sm">{taste}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Cultural Preferences</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {CULTURAL_PREFERENCES.map((culture) => (
                      <div key={culture} className="flex items-center space-x-2">
                        <Checkbox
                          id={culture}
                          onCheckedChange={(checked) => {
                            const current = form.getValues('culturalPreferences');
                            if (checked) {
                              form.setValue('culturalPreferences', [...current, culture]);
                            } else {
                              form.setValue('culturalPreferences', current.filter(c => c !== culture));
                            }
                          }}
                        />
                        <Label htmlFor={culture} className="text-sm">{culture}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    onCheckedChange={(checked) => form.setValue('isPublic', !!checked)}
                  />
                  <Label htmlFor="isPublic" className="text-sm">
                    Make my profile public (allow sharing recipes with the community under my name)
                  </Label>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              {currentStep < STEPS.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit">
                  Complete Setup
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;