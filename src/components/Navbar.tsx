import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import nutreXaLogo from "@/assets/nutrexa-logo-white.svg";
import { 
  Activity, 
  Users, 
  ChefHat, 
  Settings, 
  Bell,
  Search,
  Menu,
  LogOut,
  X,
  CalendarDays,
  AlertTriangle,
  Globe
} from "lucide-react";

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Navbar = ({ activeTab = "dashboard", onTabChange }: NavbarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "plan", label: "My Plan", icon: CalendarDays },
    { id: "community", label: "Community", icon: Users },
    { id: "profile", label: "Profile", icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === "plan") {
      navigate('/my-plan');
    } else {
      onTabChange?.(tabId);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/signin');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSearch = () => {
    setIsSearchOpen(true);
  };

  const performSearch = () => {
    if (searchQuery.trim()) {
      // For now, navigate to dashboard with search context
      onTabChange?.('dashboard');
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const searchResults = [
    { id: 1, name: "Grilled Salmon with Quinoa", type: "meal" },
    { id: 2, name: "Chicken Tikka", type: "meal" },
    { id: 3, name: "Greek Yogurt Parfait", type: "meal" },
    { id: 4, name: "Glucose Chart", type: "feature" },
    { id: 5, name: "My Plan", type: "feature" }
  ].filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <nav className="bg-gradient-to-r from-primary to-secondary border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer" 
              onClick={() => navigate('/dashboard')}
            >
              <img 
                src={nutreXaLogo} 
                alt="Nutrexa" 
                className="h-8 w-auto"
              />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2 ${
                    isActive ? "bg-white/20 text-white hover:bg-white/30" : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={handleSearch} className="text-white/80 hover:text-white hover:bg-white/10">
              <Search className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="relative text-white/80 hover:text-white hover:bg-white/10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer">
                    <Bell className="h-4 w-4" />
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      3
                    </Badge>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="px-3 py-2 border-b">
                    <h4 className="font-semibold">Notifications & Alerts</h4>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <DropdownMenuItem className="flex items-start gap-3 p-3 bg-destructive/10">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">Low Glucose Alert</p>
                        <p className="text-xs text-muted-foreground">Reading of 65 mg/dL at 8:15 AM</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-start gap-3 p-3 bg-warning/10">
                      <Bell className="h-4 w-4 text-warning mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">Medication Reminder</p>
                        <p className="text-xs text-muted-foreground">Time for your evening Metformin</p>
                        <p className="text-xs text-muted-foreground mt-1">30 minutes ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-start gap-3 p-3">
                      <Activity className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">New Meal Recommendation</p>
                        <p className="text-xs text-muted-foreground">3 new meals added to your plan</p>
                        <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </Button>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-white/20 hover:ring-white/40 transition-all">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={user?.name} />
                    <AvatarFallback className="bg-white/20 text-white text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover z-50">
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/summary')}>
                    <Activity className="mr-2 h-4 w-4" />
                    View Summary
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-plan')}>
                    <ChefHat className="mr-2 h-4 w-4" />
                    Today's Plan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2">
                    <Label className="text-xs text-muted-foreground mb-2 block">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-full h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="fa">🇮🇷 Persian</SelectItem>
                        <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="md:hidden text-white/80 hover:text-white hover:bg-white/10">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2 whitespace-nowrap ${
                    isActive ? "bg-white/20 text-white hover:bg-white/30" : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Nutrexa
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search for meals, features, or pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                className="pr-10"
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {searchQuery && (
              <div className="max-h-48 overflow-y-auto">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Search Results
                </div>
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        className="w-full text-left p-2 rounded-md hover:bg-muted flex items-center gap-2"
                        onClick={() => {
                          if (result.type === 'meal') {
                            onTabChange?.('dashboard');
                          } else if (result.name === 'My Plan') {
                            navigate('/my-plan');
                          } else {
                            onTabChange?.('dashboard');
                          }
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        {result.type === 'meal' ? (
                          <ChefHat className="h-4 w-4 text-primary" />
                        ) : (
                          <Activity className="h-4 w-4 text-primary" />
                        )}
                        <span>{result.name}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {result.type}
                        </Badge>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground p-2">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;