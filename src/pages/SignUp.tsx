import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, User, Stethoscope, ChefHat } from 'lucide-react';
import nutreXaLogo from '@/assets/nutrexa-logo-white.svg';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['patient', 'specialist', 'meal-creator'], {
    required_error: "Please select your role",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: undefined,
    },
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    const dashboardPath = user?.role === 'specialist' 
      ? '/dashboard/specialist'
      : user?.role === 'meal-creator'
      ? '/dashboard/meal-creator'
      : '/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password, data.name, data.role);
      
      // Show email verification message
      toast({
        title: "Verification email sent! ✉️",
        description: "Please check your email to verify your account. You can still proceed to set up your profile.",
        duration: 5000,
      });
      
      // Also show welcome message
      setTimeout(() => {
        toast({
          title: "Account created!",
          description: "Welcome to Nutrexa. Let's get you set up.",
        });
      }, 500);
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={nutreXaLogo} 
              alt="Nutrexa" 
              className="h-10 w-auto"
            />
          </div>
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Join Nutrexa to start managing your diabetes with personalized nutrition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...form.register('confirmPassword')}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label>I am signing up as...</Label>
              <RadioGroup
                onValueChange={(value) => form.setValue('role', value as any)}
                value={form.watch('role')}
              >
                <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="patient" id="patient" />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="patient" className="font-medium cursor-pointer flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Patient
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Managing my diabetes with personalized nutrition
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="specialist" id="specialist" />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="specialist" className="font-medium cursor-pointer flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Healthcare Specialist
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Healthcare professional helping patients manage diabetes
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="meal-creator" id="meal-creator" />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="meal-creator" className="font-medium cursor-pointer flex items-center gap-2">
                      <ChefHat className="h-4 w-4" />
                      Meal Creator
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Creating nutritious meal plans for the community
                    </p>
                  </div>
                </div>
              </RadioGroup>
              {form.formState.errors.role && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.role.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Your health data is encrypted and secure.</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;