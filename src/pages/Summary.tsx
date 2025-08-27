import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Activity, TrendingUp, Target, Download, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Achievements from "@/components/Achievements";

const Summary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data - in real app, this would come from user's health data
  const healthMetrics = {
    averageGlucose: 118,
    timeInRange: 78, // percentage
    glucoseVariability: "Low",
    lastUpdated: new Date().toLocaleDateString()
  };

  const foodImpactData = {
    helpfulFoods: ["Grilled Salmon", "Greek Yogurt", "Zucchini Noodles", "Asian Lettuce Wraps"],
    watchFoods: ["White Rice", "Soda", "Pasta", "Sweet Treats"]
  };

  const handleExport = () => {
    // Placeholder for export functionality
    alert("Export functionality would be implemented here. This could generate a PDF report or CSV data file.");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Health Summary</h1>
            <p className="text-muted-foreground">Your comprehensive health overview for the last 30 days</p>
          </div>

          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Overall Glucose Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Glucose Control Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {healthMetrics.averageGlucose} mg/dL
                  </div>
                  <p className="text-sm text-muted-foreground">Average Glucose</p>
                  <Badge variant="secondary" className="mt-2">
                    {healthMetrics.averageGlucose < 140 ? "Good Control" : "Needs Attention"}
                  </Badge>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-2">
                    {healthMetrics.timeInRange}%
                  </div>
                  <p className="text-sm text-muted-foreground">Time in Range (70-180 mg/dL)</p>
                  <Badge variant="secondary" className="mt-2">
                    {healthMetrics.timeInRange > 70 ? "Excellent" : healthMetrics.timeInRange > 50 ? "Good" : "Improve"}
                  </Badge>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning mb-2">
                    {healthMetrics.glucoseVariability}
                  </div>
                  <p className="text-sm text-muted-foreground">Glucose Variability</p>
                  <Badge variant="secondary" className="mt-2">
                    Stable Pattern
                  </Badge>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-sm text-muted-foreground">
                Last updated: {healthMetrics.lastUpdated}
              </div>
            </CardContent>
          </Card>

          {/* Meal Impact Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Meal Impact Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Foods That Help You
                  </h4>
                  <div className="space-y-2">
                    {foodImpactData.helpfulFoods.map((food, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">{food}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-warning mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Foods to Watch
                  </h4>
                  <div className="space-y-2">
                    {foodImpactData.watchFoods.map((food, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-warning rounded-full"></div>
                        <span className="text-sm">{food}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Insight:</strong> Your glucose responds best to high-protein, low-carb meals. 
                  Mediterranean and Asian cuisines show the most consistent positive impact on your levels.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Section */}
          {user?.achievements && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Achievements achievements={user.achievements} />
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => navigate('/my-plan')}>
                  View My Diet Plan
                </Button>
                <Button variant="outline" onClick={() => navigate('/profile')}>
                  Update Health Profile
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  Download Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Summary;