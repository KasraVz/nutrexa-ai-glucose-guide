import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import GlucoseChart from "@/components/GlucoseChart";
import QuickStats from "@/components/QuickStats";
import MealRecommendations from "@/components/MealRecommendations";
import FoodLogger from "@/components/FoodLogger";
import HealthSummary from "@/components/HealthSummary";
import Achievements from "@/components/Achievements";
import SmartSuggestions from "@/components/SmartSuggestions";
import QuickLogDialog from "@/components/QuickLogDialog";
import SupportChat from "@/components/SupportChat";
import MoodCheckInDialog from "@/components/MoodCheckInDialog";
import heroImage from "@/assets/nutrexa-hero.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Activity, Users, Trophy, Heart, ArrowLeft, Calendar, Loader2, Sparkles, Shield, ChefHat, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { notifications } from "@/lib/notifications";
import { Link } from "react-router-dom";

// Import all meals from MealRecommendations
const allMeals = [
  {
    id: 1,
    name: "Grilled Salmon with Quinoa",
    culture: "Mediterranean",
    glucoseImpact: "low",
    prepTime: "25 min",
    calories: 420,
    protein: 32,
    carbs: 28,
    fiber: 6,
    description: "Omega-3 rich salmon with fiber-packed quinoa and roasted vegetables",
    compatibility: 95,
  },
  {
    id: 2,
    name: "Chicken Tikka with Cauliflower Rice",
    culture: "Indian",
    glucoseImpact: "low",
    prepTime: "30 min",
    calories: 380,
    protein: 35,
    carbs: 15,
    fiber: 8,
    description: "Protein-rich chicken in aromatic spices with low-carb cauliflower rice",
    compatibility: 92,
  },
  {
    id: 3,
    name: "Asian Lettuce Wraps with Tofu",
    culture: "Asian",
    glucoseImpact: "very low",
    prepTime: "20 min",
    calories: 290,
    protein: 18,
    carbs: 12,
    fiber: 5,
    description: "Fresh, crispy lettuce wraps with seasoned tofu and vegetables",
    compatibility: 89,
  },
  {
    id: 4,
    name: "Greek Yogurt Parfait",
    culture: "Mediterranean",
    glucoseImpact: "very low",
    prepTime: "5 min",
    calories: 220,
    protein: 20,
    carbs: 18,
    fiber: 4,
    description: "Protein-rich Greek yogurt with berries and nuts",
    compatibility: 88,
  },
  {
    id: 5,
    name: "Zucchini Noodles with Pesto",
    culture: "Italian",
    glucoseImpact: "very low",
    prepTime: "15 min",
    calories: 280,
    protein: 12,
    carbs: 8,
    fiber: 6,
    description: "Low-carb zucchini noodles with fresh basil pesto",
    compatibility: 91,
  },
  {
    id: 6,
    name: "Turkey and Avocado Wrap",
    culture: "American",
    glucoseImpact: "moderate",
    prepTime: "10 min",
    calories: 380,
    protein: 28,
    carbs: 32,
    fiber: 8,
    description: "Whole grain wrap with lean turkey and fresh avocado",
    compatibility: 85,
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [generatedMeals, setGeneratedMeals] = useState<typeof allMeals | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPlan, setAiPlan] = useState<typeof allMeals | null>(null);
  const [isCgmModalOpen, setIsCgmModalOpen] = useState(false);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [isMoodCheckInOpen, setIsMoodCheckInOpen] = useState(false);
  const { user, setDailyPlan, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Demo notification on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      notifications.mealReminder('lunch', 'A chicken salad would be a great choice to keep your energy stable.');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Mood check-in prompt
  useEffect(() => {
    const today = new Date().toDateString();
    const lastMoodDate = user?.profile?.moodHistory?.[0]?.date;
    const hasLoggedToday = lastMoodDate && new Date(lastMoodDate).toDateString() === today;
    
    if (!hasLoggedToday && user?.profile) {
      // Show dialog after 5 seconds
      const timer = setTimeout(() => setIsMoodCheckInOpen(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleMoodSelect = (mood: 'happy' | 'okay' | 'neutral' | 'worried' | 'angry') => {
    if (!user?.profile) return;
    
    const updatedMoodHistory = [
      { date: new Date().toISOString(), mood },
      ...(user.profile.moodHistory || []).slice(0, 29) // Keep last 30 days
    ];
    
    updateProfile({
      ...user.profile,
      moodHistory: updatedMoodHistory
    });
    
    toast({
      title: "Mood logged! 💭",
      description: "Thanks for sharing. We'll use this to better support you.",
    });
  };

  const generateAIMealPlan = () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock current glucose level - in real app, get from GlucoseChart component
      const currentGlucose = 95; // Example glucose level
      
      // Get user preferences from profile
      const userCultures = user?.profile?.culturalPreferences || [];
      const userAllergies = user?.profile?.allergies || [];
      
      let preferredMeals = allMeals;
      
      // Filter by cultural preferences if available
      if (userCultures.length > 0) {
        const culturalMatches = allMeals.filter(meal => 
          userCultures.some(culture => 
            meal.culture.toLowerCase().includes(culture.toLowerCase())
          )
        );
        if (culturalMatches.length >= 3) {
          preferredMeals = culturalMatches;
        }
      }
      
      // Filter by glucose level
      if (currentGlucose > 140) {
        // High glucose - prioritize very low and low impact meals
        preferredMeals = preferredMeals.filter(meal => 
          meal.glucoseImpact === 'very low' || meal.glucoseImpact === 'low'
        );
      } else if (currentGlucose > 100) {
        // Elevated - mix of low and very low impact
        preferredMeals = preferredMeals.filter(meal => 
          meal.glucoseImpact === 'very low' || meal.glucoseImpact === 'low'
        );
      }
      
      // Select 3-4 random meals from preferred list
      const shuffled = [...preferredMeals].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(4, shuffled.length));
      
      setGeneratedMeals(selected);
      setAiPlan(selected);
      setDailyPlan(selected);
      setIsGenerating(false);
      
      const message = userCultures.length > 0
        ? `Based on your ${userCultures.join(', ')} cuisine preferences and current glucose of ${currentGlucose} mg/dL`
        : `Based on your current glucose of ${currentGlucose} mg/dL`;
      
      notifications.achievement('AI Plan Generated!', message);
    }, 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-primary to-primary-glow rounded-2xl overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src={heroImage}
                  alt="Nutrexa - Smart Nutrition for Diabetes Management"
                  className="w-full h-full object-cover opacity-20"
                />
              </div>
              <div className="relative p-8 text-primary-foreground">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Welcome back, {user?.name || 'John'}! 👋
                </h1>
                
                {/* Dynamic Health Summary */}
                <div className="mb-6">
                  <HealthSummary 
                    userName={user?.name || 'John'} 
                    currentGlucose={95}
                    userProfile={user?.profile}
                  />
                </div>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={generateAIMealPlan}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating AI Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate AI Plan for Today
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <QuickStats />

            {/* Smart Suggestions */}
            <SmartSuggestions userProfile={user?.profile} currentGlucose={95} />

            {/* Quick Action Button */}
            <Button 
              onClick={() => setIsQuickLogOpen(true)}
              className="w-full"
              size="lg"
            >
              <Zap className="mr-2 h-5 w-5" />
              Quick Log / Simulate Meal
            </Button>

            {/* Patient ID Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Your Patient ID
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Share this ID with your healthcare specialist to allow them to monitor your glucose levels
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-background rounded-md border font-mono text-sm">
                    {user?.id}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(user?.id || '');
                      toast({
                        title: "Copied!",
                        description: "Patient ID copied to clipboard",
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Today's AI-Generated Plan */}
            {aiPlan && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Today's AI-Generated Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {aiPlan.map((meal) => (
                      <div key={meal.id} className="p-3 bg-muted/50 rounded-lg">
                        <h4 className="font-medium text-sm mb-1">{meal.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{meal.culture}</p>
                        <div className="text-xs space-y-1">
                          <div>🔥 {meal.calories} cal</div>
                          <div>⏱ {meal.prepTime}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate('/my-plan')}>
                      <ChefHat className="h-4 w-4 mr-2" />
                      View Full Plan
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAiPlan(null)}>
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GlucoseChart className="mb-6" />
              <MealRecommendations meals={generatedMeals} />
            </div>
              
              <div className="space-y-6">
                <FoodLogger />
                
                {/* Achievements */}
                {user?.achievements && (
                  <Achievements achievements={user.achievements} />
                )}
                
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsCgmModalOpen(true)}>
                      <Activity className="h-4 w-4 mr-2" />
                      Connect CGM Device
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/profile')}>
                      <Heart className="h-4 w-4 mr-2" />
                      Update Health Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/my-plan">
                        <Calendar className="h-4 w-4 mr-2" />
                        My Diet Plan
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      
      case "community":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Community Recipes</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Connect with Others</h3>
                <p className="text-muted-foreground mb-4">
                  Share recipes and learn from the Nutrexa community
                </p>
                <Button>Explore Community</Button>
              </CardContent>
            </Card>
          </div>
        );
        
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Your Profile</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent-foreground">JD</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">John Doe</h3>
                <p className="text-muted-foreground mb-4">
                  Managing diabetes with smart nutrition since 2024
                </p>
                <Button variant="outline">Edit Profile</Button>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* CGM Device Modal */}
      <AlertDialog open={isCgmModalOpen} onOpenChange={setIsCgmModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Connect Your CGM Device
            </AlertDialogTitle>
            <AlertDialogDescription>
              This feature will allow you to automatically sync your blood glucose readings from your Continuous Glucose Monitor (CGM) device. This functionality is coming soon and will support major CGM brands like Dexcom, Freestyle Libre, and Medtronic.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsCgmModalOpen(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quick Log Dialog */}
      <QuickLogDialog 
        open={isQuickLogOpen} 
        onOpenChange={setIsQuickLogOpen} 
      />

      {/* Support Chat */}
      <SupportChat 
        open={isSupportChatOpen} 
        onOpenChange={setIsSupportChatOpen} 
      />

      {/* Mood Check-In Dialog */}
      <MoodCheckInDialog
        open={isMoodCheckInOpen}
        onOpenChange={setIsMoodCheckInOpen}
        onMoodSelect={handleMoodSelect}
      />
    </div>
  );
};

export default Index;
