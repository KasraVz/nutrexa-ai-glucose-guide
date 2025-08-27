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
import { Progress } from '@/components/ui/progress';
import { useAuth, UserProfile } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, Check, ChevronsUpDown, X, ArrowRight, ArrowLeft, Activity, Utensils, Moon, Pill } from 'lucide-react';

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

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', icon: '🪑', desc: 'Little or no exercise' },
  { value: 'light', label: 'Light', icon: '🚶', desc: 'Light exercise 1-3 days/week' },
  { value: 'moderate', label: 'Moderate', icon: '🏃', desc: 'Moderate exercise 3-5 days/week' },
  { value: 'active', label: 'Active', icon: '💪', desc: 'Hard exercise 6-7 days/week' },
  { value: 'very-active', label: 'Very Active', icon: '🏋️', desc: 'Very hard exercise, physical job' }
];

const DIABETES_TYPES = [
  { value: 'type1', label: 'Type 1', icon: '🩺', desc: 'Insulin-dependent diabetes' },
  { value: 'type2', label: 'Type 2', icon: '🍎', desc: 'Non-insulin-dependent diabetes' },
  { value: 'prediabetes', label: 'Pre-diabetes', icon: '⚠️', desc: 'Elevated blood sugar levels' }
];

const OnboardingMultiStep = () => {
  const { updateProfile, setHasCompletedOnboarding, setJustSignedUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [allergiesOpen, setAllergiesOpen] = useState(false);
  const [culturalOpen, setCulturalOpen] = useState(false);
  const [medicationsOpen, setMedicationsOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');

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

  const steps = [
    { title: 'Health Conditions', icon: '🩺', description: 'Tell us about your diabetes type' },
    { title: 'Personal Info', icon: '👤', description: 'Basic information about yourself' },
    { title: 'Lifestyle', icon: '🏃', description: 'Activity level and sleep habits' },
    { title: 'Medications', icon: '💊', description: 'Current medications you take' },
    { title: 'Preferences', icon: '🍽️', description: 'Food preferences and restrictions' }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const onSubmit = (data: OnboardingForm) => {
    const profile: UserProfile = {
      age: data.age,
      weight: data.weight,
      height: data.height,
      diabetesType: data.diabetesType,
      activityLevel: data.activityLevel,
      sleepHours: data.sleepHours,
      allergies: data.allergies,
      tastePreferences: [],
      culturalPreferences: data.culturalPreferences,
      medications: data.medications,
      isPublic: data.isPublic,
    };
    
    updateProfile(profile);
    setHasCompletedOnboarding(true);
    setJustSignedUp(false);
    
    toast({
      title: "Profile completed! 🎉",
      description: "Welcome to Nutrexa. Your personalized journey begins now.",
    });
    
    navigate('/dashboard');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addMedication = (medication: string) => {
    const current = form.getValues('medications');
    if (!current.includes(medication)) {
      form.setValue('medications', [...current, medication]);
    }
    setMedicationsOpen(false);
  };

  const addCustomMedication = () => {
    if (customInput.trim()) {
      addMedication(customInput.trim());
      setCustomInput('');
    }
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

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Health Conditions
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🩺</div>
              <h2 className="text-2xl font-bold mb-2">Health Conditions</h2>
              <p className="text-muted-foreground">Tell us about your diabetes type to personalize your experience</p>
            </div>
            
            <div className="space-y-4">
              <Label className="text-base">What type of diabetes do you have?</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DIABETES_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => form.setValue('diabetesType', type.value as any)}
                    className={`p-4 rounded-lg border-2 transition-all hover:border-primary/50 text-left ${
                      form.watch('diabetesType') === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/30'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-muted-foreground">{type.desc}</div>
                  </button>
                ))}
              </div>
              {form.formState.errors.diabetesType && (
                <p className="text-sm text-destructive">{form.formState.errors.diabetesType.message}</p>
              )}
            </div>
          </div>
        );

      case 1: // Personal Info
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">👤</div>
              <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
              <p className="text-muted-foreground">Help us understand your physical characteristics</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  {...form.register('age')}
                />
                {form.formState.errors.age && (
                  <p className="text-sm text-destructive">{form.formState.errors.age.message}</p>
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
                  <p className="text-sm text-destructive">{form.formState.errors.weight.message}</p>
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
                  <p className="text-sm text-destructive">{form.formState.errors.height.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2: // Lifestyle
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🏃</div>
              <h2 className="text-2xl font-bold mb-2">Lifestyle</h2>
              <p className="text-muted-foreground">Tell us about your activity level and sleep habits</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base">How active are you?</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  {ACTIVITY_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => form.setValue('activityLevel', level.value as any)}
                      className={`p-4 rounded-lg border-2 transition-all hover:border-primary/50 text-center ${
                        form.watch('activityLevel') === level.value
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-primary/30'
                      }`}
                    >
                      <div className="text-2xl mb-2">{level.icon}</div>
                      <div className="font-medium text-sm">{level.label}</div>
                      <div className="text-xs text-muted-foreground">{level.desc}</div>
                    </button>
                  ))}
                </div>
                {form.formState.errors.activityLevel && (
                  <p className="text-sm text-destructive">{form.formState.errors.activityLevel.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sleepHours" className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Average Sleep Hours
                </Label>
                <Input
                  id="sleepHours"
                  type="number"
                  min="3"
                  max="12"
                  placeholder="8"
                  {...form.register('sleepHours')}
                />
                {form.formState.errors.sleepHours && (
                  <p className="text-sm text-destructive">{form.formState.errors.sleepHours.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3: // Medications
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">💊</div>
              <h2 className="text-2xl font-bold mb-2">Current Medications</h2>
              <p className="text-muted-foreground">Help us understand what medications you're taking</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Popover open={medicationsOpen} onOpenChange={setMedicationsOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 justify-between">
                      Search medications...
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search medications..." />
                      <CommandEmpty>
                        <div className="p-4 text-center">
                          <p className="text-sm text-muted-foreground mb-2">No medication found.</p>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add custom medication"
                              value={customInput}
                              onChange={(e) => setCustomInput(e.target.value)}
                              className="text-sm"
                            />
                            <Button size="sm" onClick={addCustomMedication}>
                              Add
                            </Button>
                          </div>
                        </div>
                      </CommandEmpty>
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
              </div>
              
              {form.watch('medications').length > 0 && (
                <div className="space-y-3">
                  <Label>Selected Medications</Label>
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
                </div>
              )}
            </div>
          </div>
        );

      case 4: // Preferences
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🍽️</div>
              <h2 className="text-2xl font-bold mb-2">Food Preferences</h2>
              <p className="text-muted-foreground">Tell us about your dietary restrictions and preferences</p>
            </div>
            
            <div className="space-y-6">
              {/* Allergies */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasAllergies"
                    checked={form.watch('hasAllergies')}
                    onCheckedChange={(checked) => form.setValue('hasAllergies', !!checked)}
                  />
                  <Label htmlFor="hasAllergies" className="text-base">I have food allergies</Label>
                </div>
                
                {form.watch('hasAllergies') && (
                  <div className="space-y-3 pl-6">
                    <Popover open={allergiesOpen} onOpenChange={setAllergiesOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
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
                                      form.watch('allergies').includes(allergy) ? "opacity-100" : "opacity-0"
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
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasCulturalPreferences"
                    checked={form.watch('hasCulturalPreferences')}
                    onCheckedChange={(checked) => form.setValue('hasCulturalPreferences', !!checked)}
                  />
                  <Label htmlFor="hasCulturalPreferences" className="text-base">I have cultural dietary preferences</Label>
                </div>
                
                {form.watch('hasCulturalPreferences') && (
                  <div className="space-y-3 pl-6">
                    <Popover open={culturalOpen} onOpenChange={setCulturalOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          Add preference...
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search preferences..." />
                          <CommandEmpty>No preference found.</CommandEmpty>
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
                                      form.watch('culturalPreferences').includes(preference) ? "opacity-100" : "opacity-0"
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
              <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
                <Checkbox
                  id="isPublic"
                  checked={form.watch('isPublic')}
                  onCheckedChange={(checked) => form.setValue('isPublic', !!checked)}
                />
                <div className="space-y-1">
                  <Label htmlFor="isPublic" className="text-base">Make my profile public</Label>
                  <p className="text-sm text-muted-foreground">Allow other users to see your achievements and progress</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Nutrexa</h1>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-center gap-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                    index === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index < currentStep
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <span>{step.icon}</span>
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          <form className="space-y-8">
            {renderStep()}
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingMultiStep;