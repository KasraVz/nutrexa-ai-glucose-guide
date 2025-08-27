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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useAuth, UserProfile } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, Shield, Save, Check, ChevronsUpDown, X, ArrowLeft } from 'lucide-react';

const profileSchema = z.object({
  age: z.coerce.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120'),
  weight: z.coerce.number().min(20, 'Weight must be at least 20 kg').max(500, 'Weight must be less than 500 kg'),
  height: z.coerce.number().min(100, 'Height must be at least 100 cm').max(250, 'Height must be less than 250 cm'),
  diabetesType: z.enum(['type1', 'type2', 'prediabetes']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very-active']),
  sleepHours: z.coerce.number().min(3, 'Sleep hours must be at least 3').max(12, 'Sleep hours must be less than 12'),
  allergies: z.array(z.string()).default([]),
  tastePreferences: z.array(z.string()).default([]),
  culturalPreferences: z.array(z.string()).default([]),
  isPublic: z.boolean().default(false),
});

type ProfileForm = z.infer<typeof profileSchema>;

const ALLERGIES = ['Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy'];
const TASTE_PREFERENCES = ['Sweet', 'Spicy', 'Savory', 'Bitter', 'Sour', 'Mild'];
const CULTURAL_PREFERENCES = ['Mediterranean', 'Asian', 'Mexican', 'Indian', 'Italian', 'American'];

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [hasAllergies, setHasAllergies] = useState(user?.profile?.allergies?.length > 0 || false);
  const [hasCulturalPreferences, setHasCulturalPreferences] = useState(user?.profile?.culturalPreferences?.length > 0 || false);
  const [allergiesOpen, setAllergiesOpen] = useState(false);
  const [culturalOpen, setCulturalOpen] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: user?.profile?.age || 0,
      weight: user?.profile?.weight || 0,
      height: user?.profile?.height || 0,
      diabetesType: user?.profile?.diabetesType || 'type2',
      activityLevel: user?.profile?.activityLevel || 'moderate',
      sleepHours: user?.profile?.sleepHours || 8,
      allergies: user?.profile?.allergies || [],
      tastePreferences: user?.profile?.tastePreferences || [],
      culturalPreferences: user?.profile?.culturalPreferences || [],
      isPublic: user?.profile?.isPublic || false,
    },
  });

  const onSubmit = (data: ProfileForm) => {
    const profile: UserProfile = data as UserProfile;
    
    updateProfile(profile);
    setIsEditing(false);
    
    toast({
      title: "Profile updated!",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground">Manage your health information and preferences</p>
            </div>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your basic account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground">{user?.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Health Profile</CardTitle>
              <CardDescription>Your health information and medical conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Health Conditions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Health Conditions</h3>
                  <div className="space-y-2">
                    <Label htmlFor="diabetesType">Diabetes Type</Label>
                    <Select 
                      value={form.watch('diabetesType')}
                      onValueChange={(value) => form.setValue('diabetesType', value as any)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="type1">Type 1 Diabetes</SelectItem>
                        <SelectItem value="type2">Type 2 Diabetes</SelectItem>
                        <SelectItem value="prediabetes">Pre-diabetes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        {...form.register('age')}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        {...form.register('weight')}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        {...form.register('height')}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Lifestyle */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Lifestyle</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="activityLevel">Activity Level</Label>
                      <Select 
                        value={form.watch('activityLevel')}
                        onValueChange={(value) => form.setValue('activityLevel', value as any)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="very-active">Very Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sleepHours">Sleep Hours</Label>
                      <Input
                        id="sleepHours"
                        type="number"
                        min="3"
                        max="12"
                        {...form.register('sleepHours')}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Preferences */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Preferences</h3>
                  
                  <div className="space-y-3">
                    <Label>Do you have any food allergies?</Label>
                    <Select 
                      value={hasAllergies ? 'yes' : 'no'}
                      onValueChange={(value) => {
                        setHasAllergies(value === 'yes');
                        if (value === 'no') {
                          form.setValue('allergies', []);
                        }
                      }}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {hasAllergies && (
                      <div className="space-y-2">
                        <Label>Search and select allergies</Label>
                        <div className="space-y-2">
                          <Popover open={allergiesOpen} onOpenChange={setAllergiesOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={allergiesOpen}
                                className="w-full justify-between"
                                disabled={!isEditing}
                              >
                                Search allergies...
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 z-50" style={{ zIndex: 9999 }}>
                              <Command>
                                <CommandInput placeholder="Search allergies..." />
                                <CommandEmpty>No allergy found.</CommandEmpty>
                                <CommandList>
                                  <CommandGroup>
                                    {ALLERGIES.filter(allergy => !form.watch('allergies').includes(allergy)).map((allergy) => (
                                      <CommandItem
                                        key={allergy}
                                        onSelect={() => {
                                          const current = form.getValues('allergies');
                                          form.setValue('allergies', [...current, allergy]);
                                          setAllergiesOpen(false);
                                        }}
                                      >
                                        <Check className="mr-2 h-4 w-4 opacity-0" />
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
                                <div key={allergy} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
                                  <span>{allergy}</span>
                                  {isEditing && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = form.getValues('allergies');
                                        const newAllergies = current.filter(a => a !== allergy);
                                        form.setValue('allergies', newAllergies);
                                        if (newAllergies.length === 0) {
                                          setHasAllergies(false);
                                        }
                                      }}
                                      className="ml-1 text-muted-foreground hover:text-foreground"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>Taste Preferences</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {TASTE_PREFERENCES.map((taste) => (
                        <div key={taste} className="flex items-center space-x-2">
                          <Checkbox
                            id={taste}
                            checked={form.watch('tastePreferences').includes(taste)}
                            onCheckedChange={(checked) => {
                              const current = form.getValues('tastePreferences');
                              if (checked) {
                                form.setValue('tastePreferences', [...current, taste]);
                              } else {
                                form.setValue('tastePreferences', current.filter(t => t !== taste));
                              }
                            }}
                            disabled={!isEditing}
                          />
                          <Label htmlFor={taste} className="text-sm">{taste}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Do you have any cultural food preferences?</Label>
                    <Select 
                      value={hasCulturalPreferences ? 'yes' : 'no'}
                      onValueChange={(value) => {
                        setHasCulturalPreferences(value === 'yes');
                        if (value === 'no') {
                          form.setValue('culturalPreferences', []);
                        }
                      }}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {hasCulturalPreferences && (
                      <div className="space-y-2">
                        <Label>Search and select cultural preferences</Label>
                        <div className="space-y-2">
                          <Popover open={culturalOpen} onOpenChange={setCulturalOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={culturalOpen}
                                className="w-full justify-between"
                                disabled={!isEditing}
                              >
                                Search cultural preferences...
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 z-50" style={{ zIndex: 9999 }}>
                              <Command>
                                <CommandInput placeholder="Search cultural preferences..." />
                                <CommandEmpty>No cultural preference found.</CommandEmpty>
                                <CommandList>
                                  <CommandGroup>
                                    {CULTURAL_PREFERENCES.filter(culture => !form.watch('culturalPreferences').includes(culture)).map((culture) => (
                                      <CommandItem
                                        key={culture}
                                        onSelect={() => {
                                          const current = form.getValues('culturalPreferences');
                                          form.setValue('culturalPreferences', [...current, culture]);
                                          setCulturalOpen(false);
                                        }}
                                      >
                                        <Check className="mr-2 h-4 w-4 opacity-0" />
                                        {culture}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          
                          {form.watch('culturalPreferences').length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {form.watch('culturalPreferences').map((culture) => (
                                <div key={culture} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
                                  <span>{culture}</span>
                                  {isEditing && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = form.getValues('culturalPreferences');
                                        const newPreferences = current.filter(c => c !== culture);
                                        form.setValue('culturalPreferences', newPreferences);
                                        if (newPreferences.length === 0) {
                                          setHasCulturalPreferences(false);
                                        }
                                      }}
                                      className="ml-1 text-muted-foreground hover:text-foreground"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Privacy Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy Settings
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="isPublic">Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow sharing recipes with the community under your name
                      </p>
                    </div>
                    <Switch
                      id="isPublic"
                      checked={form.watch('isPublic')}
                      onCheckedChange={(checked) => form.setValue('isPublic', checked)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 pt-6">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;