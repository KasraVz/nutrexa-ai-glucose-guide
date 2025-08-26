import { useState } from "react";
import Navbar from "@/components/Navbar";
import GlucoseChart from "@/components/GlucoseChart";
import QuickStats from "@/components/QuickStats";
import MealRecommendations from "@/components/MealRecommendations";
import FoodLogger from "@/components/FoodLogger";
import heroImage from "@/assets/nutrexa-hero.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Trophy, Heart, ArrowLeft } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

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
                  Welcome back, John! 👋
                </h1>
                <p className="text-lg opacity-90 mb-6">
                  Your glucose is stable today. Here are your personalized meal recommendations.
                </p>
                <Button variant="secondary" size="lg">
                  View Today's Plan
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <QuickStats />

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GlucoseChart className="mb-6" />
                <MealRecommendations />
              </div>
              
              <div className="space-y-6">
                <FoodLogger />
                
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="h-4 w-4 mr-2" />
                      Connect CGM Device
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Heart className="h-4 w-4 mr-2" />
                      Update Health Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Trophy className="h-4 w-4 mr-2" />
                      View Achievements
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      
      case "meals":
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
            <h2 className="text-2xl font-bold text-foreground">Meal Planning</h2>
            <MealRecommendations />
            <FoodLogger />
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
    </div>
  );
};

export default Index;
