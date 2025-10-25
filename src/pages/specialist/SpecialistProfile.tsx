import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  specialization: z.string().min(1, 'Please select a specialization'),
  degrees: z.string().optional(),
  certifications: z.string().optional(),
  yearsOfExperience: z.coerce.number().min(0, 'Must be 0 or greater').max(70, 'Must be less than 70'),
  clinicName: z.string().optional(),
  contactEmail: z.string().email('Please enter a valid email'),
  contactPhone: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const SpecialistProfile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.name || '',
      specialization: '',
      degrees: '',
      certifications: '',
      yearsOfExperience: 0,
      clinicName: '',
      contactEmail: user?.email || '',
      contactPhone: '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      updateProfile(data as any);
      toast({
        title: "Profile updated!",
        description: "Your specialist profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your professional information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Professional Information
          </CardTitle>
          <CardDescription>
            Update your credentials and contact details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  {...form.register('fullName')}
                />
                {form.formState.errors.fullName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Select
                  onValueChange={(value) => form.setValue('specialization', value)}
                  defaultValue={form.watch('specialization')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dietitian">Dietitian</SelectItem>
                    <SelectItem value="endocrinologist">Endocrinologist</SelectItem>
                    <SelectItem value="nutritionist">Nutritionist</SelectItem>
                    <SelectItem value="diabetes-educator">Diabetes Educator</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.specialization && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.specialization.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="degrees">Degrees</Label>
              <Textarea
                id="degrees"
                placeholder="e.g., MD, PhD in Endocrinology"
                {...form.register('degrees')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications</Label>
              <Textarea
                id="certifications"
                placeholder="e.g., Board Certified Endocrinologist, Certified Diabetes Educator"
                {...form.register('certifications')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  min="0"
                  max="70"
                  {...form.register('yearsOfExperience')}
                />
                {form.formState.errors.yearsOfExperience && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.yearsOfExperience.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicName">Clinic/Hospital Name</Label>
                <Input
                  id="clinicName"
                  placeholder="e.g., City Medical Center"
                  {...form.register('clinicName')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...form.register('contactEmail')}
                />
                {form.formState.errors.contactEmail && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.contactEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="e.g., +1 (555) 123-4567"
                  {...form.register('contactPhone')}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialistProfile;
