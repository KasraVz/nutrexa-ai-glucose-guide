import React, { useState } from 'react';
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
import { useAuth, UserProfile } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, Shield, Save } from 'lucide-react';

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
  const [isEditing, setIsEditing] = useState(false);

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
                    <Label>Food Allergies</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {ALLERGIES.map((allergy) => (
                        <div key={allergy} className="flex items-center space-x-2">
                          <Checkbox
                            id={allergy}
                            checked={form.watch('allergies').includes(allergy)}
                            onCheckedChange={(checked) => {
                              const current = form.getValues('allergies');
                              if (checked) {
                                form.setValue('allergies', [...current, allergy]);
                              } else {
                                form.setValue('allergies', current.filter(a => a !== allergy));
                              }
                            }}
                            disabled={!isEditing}
                          />
                          <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
                        </div>
                      ))}
                    </div>
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
                    <Label>Cultural Preferences</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {CULTURAL_PREFERENCES.map((culture) => (
                        <div key={culture} className="flex items-center space-x-2">
                          <Checkbox
                            id={culture}
                            checked={form.watch('culturalPreferences').includes(culture)}
                            onCheckedChange={(checked) => {
                              const current = form.getValues('culturalPreferences');
                              if (checked) {
                                form.setValue('culturalPreferences', [...current, culture]);
                              } else {
                                form.setValue('culturalPreferences', current.filter(c => c !== culture));
                              }
                            }}
                            disabled={!isEditing}
                          />
                          <Label htmlFor={culture} className="text-sm">{culture}</Label>
                        </div>
                      ))}
                    </div>
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