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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { useAuth, UserProfile } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, Check, ChevronsUpDown, X } from 'lucide-react';

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
  hasAllergies: z.boolean().default(false),
  allergies: z.array(z.string()).default([]),
  hasCulturalPreferences: z.boolean().default(false),
  culturalPreferences: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  isPublic: z.boolean().default(false),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

const ALLERGIES = ['Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy', 'Fish', 'Sesame', 'Tree Nuts'];
const CULTURAL_PREFERENCES = ['Mediterranean', 'Asian', 'Mexican', 'Indian', 'Italian', 'American', 'Middle Eastern', 'African'];
const COMMON_MEDICATIONS = [
  'Metformin', 'Insulin', 'Glipizide', 'Glyburide', 'Pioglitazone', 'Sitagliptin', 'Empagliflozin', 
  'Liraglutide', 'Semaglutide', 'Atorvastatin', 'Lisinopril', 'Aspirin', 'Levothyroxine'
];

const Onboarding = () => {
  const { updateProfile, setHasCompletedOnboarding, setJustSignedUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [allergiesOpen, setAllergiesOpen] = useState(false);
  const [culturalOpen, setCulturalOpen] = useState(false);
  const [medicationsOpen, setMedicationsOpen] = useState(false);

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      hasAllergies: false,
      allergies: [],
      hasCulturalPreferences: false,
      culturalPreferences: [],
      medications: [],
      isPublic: false,
    },
  });

  const onSubmit = (data: OnboardingForm) => {
    const profile: UserProfile = {
      age: data.age,
      weight: data.weight,
      height: data.height,
      diabetesType: data.diabetesType,
      activityLevel: data.activityLevel,
      sleepHours: data.sleepHours,
      allergies: data.allergies,
      tastePreferences: [], // Keep empty for now as it's not in the single-page form
      culturalPreferences: data.culturalPreferences,
      medications: data.medications,
      isPublic: data.isPublic,
    };
    
    updateProfile(profile);
    setHasCompletedOnboarding(true);
    setJustSignedUp(false);
    
    toast({
      title: "Profile completed!",
      description: "Welcome to Nutrexa. Your personalized journey begins now.",
    });
    
    navigate('/dashboard');
  };

  const addMedication = (medication: string) => {
    const current = form.getValues('medications');
    if (!current.includes(medication)) {
      form.setValue('medications', [...current, medication]);
    }
    setMedicationsOpen(false);
  };

  const removeMedication = (medication: string) => {
    const current = form.getValues('medications');
    form.setValue('medications', current.filter(m => m !== medication));
  };

  const addAllergy = (allergy: string) => {
    const current = form.getValues('allergies');
    if (!current.includes(allergy)) {
      form.setValue('allergies', [...current, allergy]);
    }
    setAllergiesOpen(false);
  };

  const removeAllergy = (allergy: string) => {
    const current = form.getValues('allergies');
    form.setValue('allergies', current.filter(a => a !== allergy));
  };

  const addCulturalPreference = (preference: string) => {
    const current = form.getValues('culturalPreferences');
    if (!current.includes(preference)) {
      form.setValue('culturalPreferences', [...current, preference]);
    }
    setCulturalOpen(false);
  };

  const removeCulturalPreference = (preference: string) => {
    const current = form.getValues('culturalPreferences');
    form.setValue('culturalPreferences', current.filter(p => p !== preference));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Nutrexa</h1>
          </div>
          <div>
            <CardTitle className="text-xl">Complete Your Health Profile</CardTitle>
            <CardDescription>Help us personalize your nutrition experience</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Health Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Health Conditions</h3>
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
                  </SelectContent>
                </Select>
                {form.formState.errors.diabetesType && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.diabetesType.message}
                  </p>
                )}
              </div>
            </div>

            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>

            {/* Lifestyle */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Lifestyle</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Medications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Medications</h3>
              <div className="space-y-3">
                <Label>Select medications you're currently taking</Label>
                <Popover open={medicationsOpen} onOpenChange={setMedicationsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={medicationsOpen}
                      className="w-full justify-between"
                    >
                      Add medication...
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search medications..." />
                      <CommandEmpty>No medication found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {COMMON_MEDICATIONS.map((medication) => (
                            <CommandItem
                              key={medication}
                              value={medication}
                              onSelect={() => addMedication(medication)}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  form.watch('medications').includes(medication)
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              {medication}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                
                {form.watch('medications').length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.watch('medications').map((medication) => (
                      <Badge key={medication} variant="secondary" className="text-sm">
                        {medication}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-auto p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => removeMedication(medication)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Preferences</h3>
              
              {/* Food Allergies */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasAllergies"
                    checked={form.watch('hasAllergies')}
                    onCheckedChange={(checked) => form.setValue('hasAllergies', !!checked)}
                  />
                  <Label htmlFor="hasAllergies">I have food allergies</Label>
                </div>
                
                {form.watch('hasAllergies') && (
                  <div className="space-y-3">
                    <Popover open={allergiesOpen} onOpenChange={setAllergiesOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={allergiesOpen}
                          className="w-full justify-between"
                        >
                          Add allergy...
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search allergies..." />
                          <CommandEmpty>No allergy found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {ALLERGIES.map((allergy) => (
                                <CommandItem
                                  key={allergy}
                                  value={allergy}
                                  onSelect={() => addAllergy(allergy)}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      form.watch('allergies').includes(allergy)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }`}
                                  />
                                  {allergy}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    
                    {form.watch('allergies').length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {form.watch('allergies').map((allergy) => (
                          <Badge key={allergy} variant="secondary" className="text-sm">
                            {allergy}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-auto p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => removeAllergy(allergy)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cultural Preferences */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasCulturalPreferences"
                    checked={form.watch('hasCulturalPreferences')}
                    onCheckedChange={(checked) => form.setValue('hasCulturalPreferences', !!checked)}
                  />
                  <Label htmlFor="hasCulturalPreferences">I have specific cultural food preferences</Label>
                </div>
                
                {form.watch('hasCulturalPreferences') && (
                  <div className="space-y-3">
                    <Popover open={culturalOpen} onOpenChange={setCulturalOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={culturalOpen}
                          className="w-full justify-between"
                        >
                          Add cultural preference...
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search cultural preferences..." />
                          <CommandEmpty>No cultural preference found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {CULTURAL_PREFERENCES.map((preference) => (
                                <CommandItem
                                  key={preference}
                                  value={preference}
                                  onSelect={() => addCulturalPreference(preference)}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      form.watch('culturalPreferences').includes(preference)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }`}
                                  />
                                  {preference}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    
                    {form.watch('culturalPreferences').length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {form.watch('culturalPreferences').map((preference) => (
                          <Badge key={preference} variant="secondary" className="text-sm">
                            {preference}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-auto p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => removeCulturalPreference(preference)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Public Profile */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={form.watch('isPublic')}
                  onCheckedChange={(checked) => form.setValue('isPublic', !!checked)}
                />
                <Label htmlFor="isPublic" className="text-sm">
                  Make my profile public (allow sharing recipes with the community under my name)
                </Label>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button type="submit" className="w-full md:w-auto">
                Complete Setup
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;